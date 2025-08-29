import { createConversation, sendMessageToConversation } from "$lib/api";
import { history_conversation_store } from "$lib/stores/conversation_history";
import type { ResponseItem } from "$lib/types/openai";
import { wait } from "$lib/utils";
import type { ResponseOutputMessage } from "openai/resources/responses/responses.js";
import type { ConversationData } from "../types";

type Status = "pending" | "writing" | "resolved" | "rejected";

export class Conversation {

  static new(): Conversation {
    return new Conversation({
      id: "",
      title: "",
      updated_at: Date.now(),
      data: {
        object: "list",
        data: []
      }
    });
  }

  private _data: ConversationData = $state({
    id: "",
    title: "",
    // icon: "",
    data: {
      object: "list",
      data: []
    },
    description: "",
    updated_at: Date.now(),
    // timestamp: new Date().getUTCHours(),
  });

  public bufferMessage: Array<string> = $state([]);
  private _status: Status = $state("pending");

  constructor(data: ConversationData) {
    this._data = data;
    this._status = "resolved";
  }

  get id(): string {
    return this._data.id;
  }

  get title(): string {
    return this._data.title;
  }

  get status(): Status {
    return this._status;
  }

  get messages(): typeof this._data.data {
    return this._data.data;
  }

  // get icon(): string {
  //   return this._data.icon;
  // }

  get messageCount(): number {
    return this._data.data.data.length;
  }

  get responseBuffer(): Array<string> {
    return this.bufferMessage;
  }

  get currentMessage(): string {
    return this.bufferMessage.join("");
  }

  async sendMessageToAi(message: string): Promise<void> {
    this._status = "pending";

    const getStream = async () => {
      console.log("Sending message to AI:", message, this._data.id);

      const conversationId = this._data.id;
      if (conversationId === "") {
        this.bufferMessage = [];
        this.messages.data = [];
        this.addUserMessage(message);
        return createConversation("Default Conversation", message)
          .andThen(preview => {
            // Reset buffer
            const conversation: ConversationData = {
              ...this._data,
              ...preview
            };
            console.log("Creating new conversation:", conversation);
            this._data = conversation;
            history_conversation_store.addConversation(conversation);
          
            return sendMessageToConversation(preview.id, message);
          });
      } else {
        this.addUserMessage(message);
        return sendMessageToConversation(conversationId, message);
      }
    }

    const message_stream = await getStream();
    if (message_stream.isErr()) {
      throw new Error(`Failed to send message: ${message_stream.error.message}`);
    }

    this._status = "writing";
    for await (const event of message_stream.value) {
      console.log("Received event:", event);

      if (event.type === "response.output_text.delta") {
        this.bufferMessage.push(event.delta);
        await wait(20);
      // }
      } else if (event.type === "response.output_item.done") {
        if (event.item.id) {
          if (event.item.type === "message") {
            this.bufferMessage = [];
            this.addOutputAssistant(event.item);
            console.log("Output assistant added:", event.item);
          }
        } else {
          console.warn("Received done event without item ID");
        }
      }
    }

    await wait(500);
    // this.addMessage(
    //   crypto.randomUUID(),
    //   this.currentMessage, "assistant");
    // this.bufferMessage = [];

    this._status = "resolved";
  }

  private addUserMessage(message: string): void {
    this._data.data.data.push({
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: message }],
      status: "completed",
      id: crypto.randomUUID()
    } as unknown as ResponseItem);
  }

  private addOutputAssistant(message: ResponseOutputMessage): void {
    this._data.data.data.push(message);
  }

  // private addMessage(id: string, message: string, role: "user" | "assistant"): void {
  //   this._data.messages.push({ id, content: [{ text: message, type: "input_text" }], role });
  // }

}
