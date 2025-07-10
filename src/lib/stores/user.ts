import type { User } from "$lib/types";
import { writable } from "svelte/store";

export const user_store = writable<User | null>(null);