import { writable } from "svelte/store";
import type { ToastData } from "../types";

export const toasts_store = writable<ToastData[]>([]);