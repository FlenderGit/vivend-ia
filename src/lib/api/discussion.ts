import type { ConversationData, ConversationPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";

export function fetchConversationsPreview(): ResultAsyncApi<
  Array<ConversationPreviewData>
> {
  return safeRequest(api.get("discussions").json());
}

export function fetchConversationById(
  id: string
): ResultAsyncApi<ConversationData> {
  return safeRequest(api.get(`discussions/${id}`).json());
}

export function createConversation(
  data: Omit<ConversationPreviewData, "id" | "timestamp">
): ResultAsyncApi<ConversationData> {
  return safeRequest(
    api
      .post("discussions", {
        json: data,
      })
      .json()
  );
}

export function updateConversation(
  discussionId: string,
  data: Partial<Omit<ConversationPreviewData, "id" | "timestamp">>
): ResultAsyncApi<ConversationData> {
  return safeRequest(
    api
      .put(`discussions/${discussionId}`, {
        json: data,
      })
      .json()
  );
}

export function deleteConversation(discussionId: string): ResultAsyncApi<void> {
  return safeRequest(api.delete(`discussions/${discussionId}`).json());
}

export function sendMessageToConversation(
  discussionId: string,
  message: string
): ResultAsyncApi<ConversationData> {
  return safeRequest(
    api
      .post(`discussions/${discussionId}/messages`, {
        json: { message },
      })
      .json()
  );
}
