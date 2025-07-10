export type ConversationPreviewData = {
    id: string;
    title: string;
    icon: string;
    timestamp: number;
}

export type MessageData = {
    message: string;
    role: 'user' | 'assistant';
}

export type ConversationData = ConversationPreviewData & {
    messages: Array<MessageData>;
}