import type { DiscussionData, DiscussionPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";

export function fetchDiscussionsPreview(): ResultAsyncApi<
  Array<DiscussionPreviewData>
> {
  return safeRequest(api.get("discussions").json());
}

export function fetchDiscussionById(
  id: string
): ResultAsyncApi<DiscussionData> {
  return safeRequest(api.get(`discussions/${id}`).json());
}

export function createDiscussion(
  data: Omit<DiscussionPreviewData, "id" | "timestamp">
): ResultAsyncApi<DiscussionData> {
  return safeRequest(
    api
      .post("discussions", {
        json: data,
      })
      .json()
  );
}

export function updateDiscussion(
  discussionId: string,
  data: Partial<Omit<DiscussionPreviewData, "id" | "timestamp">>
): ResultAsyncApi<DiscussionData> {
  return safeRequest(
    api
      .put(`discussions/${discussionId}`, {
        json: data,
      })
      .json()
  );
}

export function deleteDiscussion(discussionId: string): ResultAsyncApi<void> {
  return safeRequest(api.delete(`discussions/${discussionId}`).json());
}

export function sendMessageToDiscussion(
  discussionId: string,
  message: string
): ResultAsyncApi<DiscussionData> {
  return safeRequest(
    api
      .post(`discussions/${discussionId}/messages`, {
        json: { message },
      })
      .json()
  );
}
