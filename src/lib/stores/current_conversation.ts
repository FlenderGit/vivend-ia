import { Conversation } from "../classes";
import { fetchConversationById } from "../api";
import { writable, type Writable } from "svelte/store";

function createCurrentConversationStore() {
  let conversation: Writable<Conversation | null> = writable(null);
  let error: Writable<Error | null> = writable(null);
  let isLoading: Writable<boolean> = writable(false);

  return {
    get conversation() {
      return conversation;
    },

    get isLoading() {
      return isLoading;
    },

    get error() {
      return error;
    },

    async loadNewConversation(id: string) {
      // Fetch api
      console.log("Loading conversation with id:", id);
      isLoading.set(true);
      error.set(null);
      conversation.set(null);
      const result = await fetchConversationById(id);
      console.log("Result of fetchConversationById:", result);
      result.match(
        (d) => conversation.set(new Conversation(d)),
        (e) => {
          error.set(e);
        }
      );
      isLoading.set(false);
      return result;
    },
  };
}

export const current_conversation_store = createCurrentConversationStore();
