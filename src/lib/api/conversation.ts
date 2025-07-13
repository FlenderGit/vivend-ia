import { getWebsiteUrl } from "$lib/utils";
import type { ReadableStreamDefaultReader } from "stream/web";
import type { ConversationData, ConversationPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";

const REQUEST_WITH = "Vivendia";

export function fetchConversationsPreview(): ResultAsyncApi<
  Array<ConversationPreviewData>
> {
  return safeRequest(api.get("conversations").json());
}

export function fetchConversationById(
  id: string
): ResultAsyncApi<ConversationData> {
  return safeRequest(api.get(`conversations/${id}`).json());
}

export function createConversation(
  title: string,
  message: string
): ResultAsyncApi<{
  preview: ConversationPreviewData;
  messages: AsyncGenerator<SseEvent>;
}> {
  async function ttt() {
    const tabName = await getWebsiteUrl();
    console.log("Creating conversation with tab name:", tabName);
    return api
      .post(`conversations`, {
        headers: {
          ...{
            "X-Tab-Name": tabName,
          },
          "X-Requested-With": REQUEST_WITH,
        },
        json: { prompt: message, title },
      })
      .then((response) => {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to get reader");
        console.log("Response headers:", response.headers);
        const conversationId = response.headers.get("X-Conversation-Id");
        if (!conversationId) throw new Error("Missing conversation ID in response headers");
        return {
          preview: {
            id: conversationId,
            title: "New Conversation",
            updated_at: Date.now(),
          },
          messages: handleSse(reader)
        };
      });
  }
  return safeRequest(
    ttt()
  );
}

export function updateConversation(
  discussionId: string,
  data: Partial<Omit<ConversationPreviewData, "id" | "timestamp">>
): ResultAsyncApi<ConversationData> {
  // Simulate a successful update with a delay
  const simulatedPromise = new Promise<ConversationData>((resolve) => {
    setTimeout(() => {
      resolve({
        ...DISCUSSION,
        timestamp: Date.now(),
        id: discussionId,
        ...data,
      });
    }, 1000);
  });
  return safeRequest(simulatedPromise);

  return safeRequest(
    api
      .put(`conversation/${discussionId}`, {
        json: data,
      })
      .json()
  );
}

export function deleteConversation(discussionId: string): ResultAsyncApi<void> {
  // Simulate a successful deletion with a delay
  const simulatedPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  return safeRequest(simulatedPromise);
  return safeRequest(api.delete(`discussions/${discussionId}`).json());
}

type SseEvent = {
  type: string;
  data: string;
};

async function* handleSse(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SseEvent> {
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    buffer += text;

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      if (event.trim()) {
        const lines = event.split("\n");
        let eventType = "message"; // type par défaut
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.replace("event: ", "").trim();
          } else if (line.startsWith("data: ")) {
            eventData = line.replace("data: ", "");
          }
        }

        if (eventData.trim() !== "") {
          yield { type: eventType, data: eventData };
        }
      }
    }
  }

  if (buffer.trim()) {
    const lines = buffer.split("\n");
    let eventType = "message"; // type par défaut
    let eventData = "";

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.replace("event: ", "").trim();
      } else if (line.startsWith("data: ")) {
        eventData = line.replace("data: ", "");
      }
    }

    if (eventData.trim() !== "") {
      yield { type: eventType, data: eventData };
    }
  }
}

export function sendMessageToConversation(
  discussionId: string,
  message: string
): ResultAsyncApi<AsyncGenerator<SseEvent>> {
  async function ttt() {
    const tabName = await getWebsiteUrl();
    return api
      .post(`conversations/${discussionId}/messages`, {
        headers: {
          ...{
            "X-Tab-Name": tabName,
          },
          "X-Requested-With": REQUEST_WITH,
        },
        json: {
          prompt: message,
        },
      })
      .then((response) => {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to get reader");
        return handleSse(reader);
      });
  }

  return safeRequest(ttt());
}
