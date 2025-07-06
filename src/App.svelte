<script lang="ts">
  import type { ToastData, User } from "./lib/types";
  import Toast from "./lib/components/ui/Toast.svelte";
  import LoginView from "./lib/view/LoginView.svelte";
  import ConversationView from "./lib/view/ConversationView.svelte";
  import { onMount } from "svelte";
  import { theme_store } from "./lib/stores/theme";
  import { toasts_store } from "./lib/stores/toasts";

  let user: User | null = $state(null);
  onMount(() => {
    // chrome.storage.local.get(["user"], (result) => {
    //   if (result.user) {
    //     user = result.user;
    //   }
    // });
    user = {
      id: "1",
      name: "John Doe",
      email: "john.doe@me.com",
    };
  });

  $effect(() => {
    console.log("Theme store updated:", $theme_store);
    Object.entries($theme_store).forEach(([key, value]) => {
      console.log(`Setting CSS variable --color-${key} to ${value}`);
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  });
</script>

{#if user === null}
  <LoginView bind:user />
{:else}
  <ConversationView {user} />
{/if}

<div class="absolute right-4 top-4 z-50">
  {#each $toasts_store as toast}
    <Toast
      {toast}
      onclose={() => {
        toasts_store.update((toasts) => toasts.filter((t) => t !== toast));
      }}
    />
  {/each}
</div>
