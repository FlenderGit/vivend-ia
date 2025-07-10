import { writable } from "svelte/store";
import type { Toast, ToastData } from "../types";

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(toast: ToastData) {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      ...toast,
      id,
    };
    update((toasts) => [...toasts, newToast]);
  }

  function removeToast(id: string) {
    update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  return {
    subscribe,
    addToast,
    removeToast,
  };
}

export const toasts_store = createToastStore();

