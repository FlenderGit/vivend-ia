import type { ResponseItem } from "./openai";

export type ConversationPreviewData = {
    id: string;
    title: string;
    // icon: string;
    updated_at: number;
}

type ListResponse<T> = {
  object: "list";
  data: T[];
  first_id?: string | null;
  last_id?: string | null;
  has_more?: boolean;
};

export type ConversationData = ConversationPreviewData & {
    data: ListResponse<ResponseItem>;
}

