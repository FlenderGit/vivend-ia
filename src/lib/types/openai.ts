import type { EasyInputMessage, ResponseFunctionToolCall, ResponseInputItem, ResponseOutputMessage } from "openai/resources/responses/responses.js";


export type OutputItemDone = ResponseOutputMessage["content"];

// 1. Type de base sans les EasyInputMessage
export type ResponseItem = Exclude<ResponseInputItem, EasyInputMessage>;

// 2. Filtrer les messages par rôle
export type UserMessage = ResponseInputItem.Message & { role: "user" };
export type AssistantMessage = ResponseOutputMessage | (ResponseInputItem.FunctionCallOutput & { name: "create_graph" });

// 3. Types pour reasoning - tout sauf les messages user/assistant
export type ResponseItemReasoning = Exclude<
  ResponseItem, 
  UserMessage | AssistantMessage
>;

// 4. Types finaux pour les éléments de conversation
export type ResponseItemUser = {  
  role: "user"; 
  message: UserMessage;
};

export type ResponseItemAssistant = {  
  role: "assistant"; 
  message: AssistantMessage[];
  reasoning: ResponseItemReasoning[];
};

export type MessageByRole = ResponseItemUser | ResponseItemAssistant;