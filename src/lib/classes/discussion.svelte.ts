import type { ConversationData } from "../types";

type Status = "pending" | "writing" | "resolved" | "rejected";

export class Conversation {

  static new(): Conversation {
    return new Conversation({
      id: "",
      title: "",
      icon: "",
      messages: [],
      description: "",
      timestamp: new Date().getUTCHours(),
    });
  }

  private _data: ConversationData = $state({
    id: "",
    title: "",
    icon: "",
    messages: [],
    description: "",
    timestamp: new Date().getUTCHours(),
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

  get icon(): string {
    return this._data.icon;
  }

  get messageCount(): number {
    return this._data.messages.length;
  }

  get responseBuffer(): Array<string> {
    return this.bufferMessage;
  }

  get currentMessage(): string {
    return this.bufferMessage.join(" ");
  }

  async sendMessageToAi(message: string): Promise<void> {
    this._status = "pending";
    this.addMessage(message, "user");
    // Simulate an AI response with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Simulate AI Response SSE writing in currentMessage
    const aiResponse = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const slices = aiResponse.split(" ");
    

    this._status = "writing";
    for (const element of slices) {
      this.bufferMessage.push(element);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // this.addMessage("This is a placeholder response.", "assistant");
    await new Promise(resolve => setTimeout(resolve, 400));
    this.addMessage(this.currentMessage, "assistant");
    this.bufferMessage = [];


    this._status = "resolved";
  }

  private addMessage(message: string, role: "user" | "assistant"): void {
    this._data.messages.push({ message, role });
  }

}
