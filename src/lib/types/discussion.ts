export type DiscussionPreviewData = {
    id: string;
    title: string;
    description: string;
    icon: string;
    timestamp: number;
}

export type MessageData = {
    message: string;
    role: 'user' | 'assistant';
}

export type DiscussionData = DiscussionPreviewData & {
    messages: Array<MessageData>;
}