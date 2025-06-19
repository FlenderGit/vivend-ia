import type { DiscussionData } from "../types";

export class Discussion {
  private _data: DiscussionData = $state({
    id: "",
    title: "",
    icon: "",
    messages: [],
  });

  constructor(data: DiscussionData) {
    this._data = data;
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

  addMessage(message: string, role: "user" | "assistant"): void {
    this._data.messages.push({ message, role });
  }

}
