export type ConversationPreviewData = {
    id: string;
    title: string;
    // icon: string;
    updated_at: number;
}

type TextMessage = {
    type: 'input_text',
    text: string
}

export type MessageData = {
    id: string;
    content: Array<TextMessage>;
    role: 'user' | 'assistant';
}

export type ConversationData = ConversationPreviewData & {
    messages: Array<MessageData>;
}