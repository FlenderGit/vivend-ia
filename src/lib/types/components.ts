export type ToastData = {
  message: string;
  description?: string;
  duration?: number;
  type: "success" | "error" | "info" | "warning";
};

export type Toast = ToastData & { id: string };

