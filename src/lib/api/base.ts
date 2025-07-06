import ky, { HTTPError } from "ky";
import { fromPromise, type ResultAsync } from "neverthrow";
import { toasts_store } from "../stores/toasts";

class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "NetworkError";
  }
}

class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export type ResultAsyncApi<T> = ResultAsync<T, Error>;

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  retry: {
    limit: 3,
    methods: ["get", "post", "put", "delete"],
    statusCodes: [408, 500, 502, 503, 504],
  },

});

const mapHttpError = (error: unknown) => {
  if (!(error instanceof HTTPError)) {
    return new NetworkError("Unknown error occurred");
  }
  if (error.name === "HTTPError") {
    const status = error.response?.status;
    switch (status) {
      case 404:
        return new NotFoundError("Resource");
      case 400:
        return new ValidationError("Invalid request data");
      case 401:
        return new NetworkError("Unauthorized", 401);
      case 403:
        return new NetworkError("Forbidden", 403);
      case 429:
        return new NetworkError("Too many requests", 429);
      case 500:
        return new NetworkError("Server error", 500);
      default:
        return new NetworkError(`HTTP ${status}`, status);
    }
  }

  if (error.name === "TimeoutError") {
    return new NetworkError("Request timeout", 408);
  }

  return new NetworkError(error.message || "Unknown network error");
};

function handleError(error: unknown): Error {
  if (!(error instanceof Error)) {
    error = new Error("An unknown error occurred");
  }
  console.error("API Error:", error);
  toasts_store.update((toasts) => [
    ...toasts,
    {
      type: "error",
      message: (error as Error).message,
      duration: 5000,
    },
  ]);
  return mapHttpError(error);
}

export function safeRequest<T>(promise: Promise<T>): ResultAsync<T, Error> {
  return fromPromise(promise, handleError);
}