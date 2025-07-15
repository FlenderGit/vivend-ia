import { CredentialsInfo } from "$lib/utils/auth";
import { writable } from "svelte/store";

export const auth_store = writable<CredentialsInfo | null>(null);