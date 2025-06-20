import type { DiscussionData } from "../types";

type Status = "pending" | "resolved" | "rejected";

export class Discussion {
  private _data: DiscussionData = $state({
    id: "",
    title: "",
    icon: "",
    messages: [],
    description: "",
    timestamp: new Date().getUTCHours(),
  });

  public currentMessage: string = $state("");
  private _status: Status = $state("pending");

  constructor(data: DiscussionData) {
    this._data = data;
    this._status = "resolved";
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

  async sendMessageToAi(message: string): Promise<void> {
    this._status = "pending";
    this.addMessage(message, "user");
    // Simulate an AI response with a delay
    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.addMessage("This is a placeholder response.", "assistant");
    this._status = "resolved";
  }

  private addMessage(message: string, role: "user" | "assistant"): void {
    this._data.messages.push({ message, role });
  }

}
