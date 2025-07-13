import { fetchConversationsPreview } from "$lib/api";
import type { ConversationPreviewData } from "$lib/types";
import { writable } from "svelte/store";

function createHistoryConversationStore() {
    const store = writable<Array<ConversationPreviewData>>([]);
    let isLoading = writable(false);
    let error = writable<string | null>(null);

    return {
        get conversations() {
            return store;
        },
        get isLoading() {
            return isLoading;
        },
        get error() {
            return error;
        },
        fetchConversations: async () => {
            isLoading.set(true);
            fetchConversationsPreview().match(
                store.set,
                (err) => {
                    error.set(err.message);
                }
            ).finally(() => {
                isLoading.set(false);
            });
        },
        addConversation: (conversation: ConversationPreviewData) => {
            store.update((conversations) => {
                return [...conversations, conversation];
            });
        },
        removeConversation: (id: string) => {
            store.update((conversations) => {
                return conversations.filter((conversation) => conversation.id !== id);
            });
        },
    }
}

export const history_conversation_store = createHistoryConversationStore();