import { createConversation, sendMessageToConversation } from "$lib/api";
import { history_conversation_store } from "$lib/stores/conversation_history";
import { wait } from "$lib/utils";
import type { ConversationData } from "../types";

type Status = "pending" | "writing" | "resolved" | "rejected";

export class Conversation {

  static new(): Conversation {
    return new Conversation({
      id: "",
      title: "",
      // icon: "",
      messages: [],
      updated_at: Date.now(),
      // timestamp: new Date().getUTCHours(),
    });
  }

  private _data: ConversationData = $state({
    id: "",
    title: "",
    // icon: "",
    messages: [],
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

  get messages(): typeof this._data.messages {
    return this._data.messages;
  }

  // get icon(): string {
  //   return this._data.icon;
  // }

  get messageCount(): number {
    return this._data.messages.length;
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
      const conversationId = this._data.id;
      if (conversationId === "") {
        this._data.messages = [
          {
            id: crypto.randomUUID(),
            role: "user",
            content: [{ text: message, type: "input_text" }]
          }
        ];
        return createConversation("Default Conversation", message)
          .map(({ preview, messages }) => {
            const conversation: ConversationData = {
              ...this._data,
              ...preview
            };
            console.log("Creating new conversation:", conversation, messages);
            this._data = conversation;
            history_conversation_store.addConversation(conversation);
            return messages;
          });
      } else {
        this.addMessage(crypto.randomUUID(), message, "user");
        return sendMessageToConversation(conversationId, message);
      }
    }

    const message_stream = await getStream();
    if (message_stream.isErr()) {
      throw new Error(`Failed to send message: ${message_stream.error.message}`);
    }

    this._status = "writing";
    for await (const event of message_stream.value) {
      this.bufferMessage.push(event.data);
      await wait(50);
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    this.addMessage(
      crypto.randomUUID(),
      this.currentMessage, "assistant");
    this.bufferMessage = [];

    this._status = "resolved";
  }

  private addMessage(id: string, message: string, role: "user" | "assistant"): void {
    this._data.messages.push({ id, content: [{ text: message, type: "input_text" }], role });
  }

}
