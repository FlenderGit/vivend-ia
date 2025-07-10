import { fetchConversationsPreview } from "$lib/api";
import type { ConversationPreviewData } from "$lib/types";
import { writable } from "svelte/store";

function createHistoryConversationStore() {
    const store = writable<Array<ConversationPreviewData>>([]);
    let isLoading = writable(false);

    return {
        get conversations() {
            return store;
        },
        get isLoading() {
            return isLoading;
        },
        fetchConversations: async () => {
            isLoading.set(true);
            fetchConversationsPreview()
        },
        setConversations: (conversations: Array<ConversationPreviewData>) => {
            store.set(conversations);
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