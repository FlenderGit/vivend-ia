import { getWebsiteUrl } from "$lib/utils";
import type { ReadableStreamDefaultReader } from "stream/web";
import type { ConversationData, ConversationPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";

const DISCUSSIONS: Array<ConversationPreviewData> = [
  {
    id: "1",
    title: "Conversation 1 - A very long title that should be truncated",
    icon: "fluent-color:calendar-edit-16",
    timestamp: 1750231897,
  },
  {
    id: "2",
    title: "Conversation 2",
    icon: "fluent-color:lightbulb-filament-16",
    timestamp: 1750230897,
  },
  {
    id: "3",
    title: "Conversation 3",
    icon: "fluent-color:chat-16",
    timestamp: 1750201897,
  },
  {
    id: "4",
    title: "Conversation 4",
    icon: "fluent-color:animal-paw-print-16",
    timestamp: 1750031897,
  },
];
const DISCUSSION: ConversationData = {
  id: "1",
  title: "My First Conversation",
  icon: "lucide:message-circle",
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
    }
  );

  return safeRequest(simulatedPromise);
  // return safeRequest(api.get("conversation").json());
}

export function fetchConversationById(
  id: string
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
  data: Partial<Omit<ConversationData, "id" | "timestamp">>
): ResultAsyncApi<ConversationData> {
  // Simulate a successful creation with a delay
  const simulatedPromise = new Promise<ConversationData>((resolve) => {
    setTimeout(() => {
      resolve({
        ...DISCUSSION,
        timestamp: Date.now(),
        id: crypto.randomUUID(),
        ...data,
      });
    }, 1000);
  });
  return safeRequest(simulatedPromise);

  return safeRequest(
    api
      .post("conversation", {
        json: data,
      })
      .json()
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
  type: "message";
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
    const lines = buffer.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");
        yield { type: "message", data };
      }
    }
  }
}

export function sendMessageToConversation(
  discussionId: string,
  message: string
): ResultAsyncApi<AsyncGenerator<SseEvent>> {
  async function ttt() {
    const tabName = await getWebsiteUrl();
    console.log("Tab name:", tabName);
    return api
      .get(`discussions/${discussionId}/messages`, {
        headers: {
          "X-Tab-Name": tabName ?? "",
        },
        json: {
          message,
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
