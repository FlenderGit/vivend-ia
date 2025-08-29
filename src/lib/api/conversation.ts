import { getWebsiteUrl } from "$lib/utils";
import type { ConversationData, ConversationPreviewData } from "../types";
import { api, safeRequest, type ResultAsyncApi } from "./base";
import type { ResponseStreamEvent } from "openai/resources/responses/responses.js";
import { EventSourceParserStream, type EventSourceMessage } from "eventsource-parser/stream";

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
): ResultAsyncApi<ConversationPreviewData> {
  return safeRequest(
    api
      .post(`conversations`, {
        json: { title, prompt: message },
      })
      .json()
  );
}

//   async function ttt() {
//     const tabName = await getWebsiteUrl();
//     console.log("Creating conversation with tab name:", tabName);
//     return api
//       .post(`conversations`, {
//         headers: {
//           ...{
//             "X-Tab-Name": tabName,
//           },
//           "X-Requested-With": REQUEST_WITH,
//         },
//         json: { prompt: message, title },
//       })
//       .then((response) => {
//         const reader = response.body?.getReader();
//         if (!reader) throw new Error("Failed to get reader");
//         console.log("Response headers:", response.headers);
//         const conversationId = response.headers.get("X-Conversation-Id");
//         if (!conversationId) throw new Error("Missing conversation ID in response headers");
//         return {
//           preview: {
//             id: conversationId,
//             title: "New Conversation",
//             updated_at: Date.now(),
//           },
//           messages: handleSse(reader)
//         };
//       });
//   }
//   return safeRequest(
//     ttt()
//   );
// }

export function updateConversation(
  conversationId: string,
  data: Partial<Omit<ConversationPreviewData, "id" | "updated_at">>
): ResultAsyncApi<ConversationPreviewData> {
  return safeRequest(
    api
      .put(`conversations/${conversationId}`, {
        json: data,
      })
      .json()
  );
}

export function deleteConversation(conversationId: string): ResultAsyncApi<string> {
  return safeRequest(api.delete(`conversations/${conversationId}`).text());
}

// async function* handleSse(
//   reader: ReadableStreamDefaultReader<Uint8Array>
// ): AsyncGenerator<SseEvent> {
//   const decoder = new TextDecoder();
//   let buffer = "";
//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) break;

//     const text = decoder.decode(value, { stream: true });
//     buffer += text;

//     const events = buffer.split("\n\n");
//     buffer = events.pop() || "";

//     for (const event of events) {
//       if (event.trim()) {
//         const lines = event.split("\n");
//         let eventType = "message"; // type par défaut
//         let eventData = "";

//         for (const line of lines) {
//           if (line.startsWith("event: ")) {
//             eventType = line.replace("event: ", "").trim();
//           } else if (line.startsWith("data: ")) {
//             eventData = line.replace("data: ", "");
//           }
//         }

//         if (eventData.trim() !== "") {
//           yield { type: eventType, data: eventData };
//         }
//       }
//     }
//   }

//   if (buffer.trim()) {
//     const lines = buffer.split("\n");
//     let eventType = "message"; // type par défaut
//     let eventData = "";

//     for (const line of lines) {
//       if (line.startsWith("event: ")) {
//         eventType = line.replace("event: ", "").trim();
//       } else if (line.startsWith("data: ")) {
//         eventData = line.replace("data: ", "");
//       }
//     }

//     if (eventData.trim() !== "") {
//       yield { type: eventType, data: eventData };
//     }
//   }
// }

export function sendMessageToConversation(
  discussionId: string,
  message: string
): ResultAsyncApi<ReadableStream<ResponseStreamEvent>> {
  // Wrap the API call in a promise to get the url of the tab
  async function promise_generator() {
    
    // Get the current tab URL to include in the request headers
    const tabName = await getWebsiteUrl();
    const res = await api
      .post(`conversations/${discussionId}/messages`, {
        headers: {
          "X-Tab-Name": tabName,
        },
        json: { prompt: message },
      });

      // Get the response body as a stream
      const webStream = res.body;
      if (!webStream) {
        throw new Error("No response body found");
      }

      // Parse the stream using EventSourceParserStream
      // and transform it into a stream of events of OpenAI ResponseStreamEvent
      const eventStream = webStream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .pipeThrough(new TransformStream({
          transform(event: EventSourceMessage, controller) {
            controller.enqueue({
              type: event.event,
              ...JSON.parse(event.data),
            });
          },
        }));
      return eventStream;
  }
  return safeRequest(promise_generator());
}