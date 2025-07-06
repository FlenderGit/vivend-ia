import { writable } from "svelte/store";
import type { Theme } from "../constants/themes";

export const theme_store = writable<Theme>({
    background: "#ffffff",
})