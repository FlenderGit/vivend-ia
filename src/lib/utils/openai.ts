import type { AssistantMessage, UserMessage } from "$lib/types/openai";
import type { ResponseInputItem } from "openai/resources/responses/responses.js";

export function is_user_message(message: ResponseInputItem): message is UserMessage {
  return message.type === "message" && message.role as any === "user";
}

export function is_assistant_message(message: ResponseInputItem): message is AssistantMessage {
  return message.type === "message" && message.role as any === "assistant";
}