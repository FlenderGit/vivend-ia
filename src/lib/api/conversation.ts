import type { ConversationData, ConversationPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";

const DISCUSSIONS: Array<ConversationPreviewData> = [
  {
    id: "1",
    title: "Conversation 1 - A very long title that should be truncated",
    description: "This is a test description. That is a test description.",
    icon: "fluent-color:calendar-edit-16",
    timestamp: 1750231897,
  },
  {
    id: "2",
    title: "Conversation 2",
    description: "Test",
    icon: "fluent-color:lightbulb-filament-16",
    timestamp: 1750230897,
  },
  {
    id: "3",
    title: "Conversation 3",
    description: "Test",
    icon: "fluent-color:chat-16",
    timestamp: 1750201897,
  },
  {
    id: "4",
    title: "Conversation 4",
    description: "Test",
    icon: "fluent-color:animal-paw-print-16",
    timestamp: 1750031897,
  },
];
const DISCUSSION: ConversationData = {
  id: "1",
  title: "My First Conversation",
  icon: "lucide:message-circle",
  description: "This is a test discussion with some example messages.",
  timestamp: Date.now(),
  messages: [
    { role: "user", message: "Hello, how are you?" },
    { role: "assistant", message: "I'm fine, thank you!" },
    { role: "user", message: "What can you do?" },
    {
      role: "assistant",
      message:
        "I can help you with various tasks. Just let me know what you need! and I'll do my best to assist you. here are some examples of what I can do:",
    },
    {
      role: "assistant",
      message:
        "1. Answer questions\n2. Provide explanations\n3. Help with coding tasks\n4. Generate creative content",
    },
    { role: "user", message: "Can you write a poem?" },
    {
      role: "assistant",
      message:
        "Sure! Here's a short poem for you:\n\nRoses are red,\nViolets are blue,\nI'm here to assist,\nJust ask, and I'll help you!",
    },
  ],
};

export function fetchConversationsPreview(): ResultAsyncApi<
  Array<ConversationPreviewData>
> {
  // Simulate a response with a delay for demonstration purposes
  const simulatedPromise = new Promise<Array<ConversationPreviewData>>(
    (resolve) => {
      setTimeout(() => {
        resolve(DISCUSSIONS);
      }, 1000);
    },
  );

  return safeRequest(simulatedPromise);
  // return safeRequest(api.get("conversation").json());
}

export function fetchConversationById(
  id: string,
): ResultAsyncApi<ConversationData> {
  // Simulate a response with a delay for demonstration purposes
  const simulatedPromise = new Promise<ConversationData>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Failed to fetch conversations"));
      }
      const discussion = DISCUSSIONS.find((d) => d.id === id);
      if (!discussion) {
        reject(new Error(`Conversation with id ${id} not found`));
      }
      resolve({
        ...DISCUSSION,
        ...discussion,
      });
    }, 1000);
  });

  return safeRequest(simulatedPromise);

  // return safeRequest(api.get(`conversation/${id}`).json());
}

export function createConversation(
  data: Omit<ConversationPreviewData, "id" | "timestamp">,
): ResultAsyncApi<ConversationData> {
  return safeRequest(
    api
      .post("conversation", {
        json: data,
      })
      .json(),
  );
}

export function updateConversation(
  discussionId: string,
  data: Partial<Omit<ConversationPreviewData, "id" | "timestamp">>,
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
      .json(),
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

export function sendMessageToConversation(
  discussionId: string,
  message: string,
): ResultAsyncApi<ConversationData> {
  return safeRequest(
    api
      .post(`discussions/${discussionId}/messages`, {
        json: { message },
      })
      .json(),
  );
}
