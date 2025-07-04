<script lang="ts">
  import type { ToastData, User } from "./lib/types";
  import Toast from "./lib/components/ui/Toast.svelte";
  import LoginView from "./lib/view/LoginView.svelte";
  import ConversationView from "./lib/view/ConversationView.svelte";
  import { onMount } from "svelte";

  let toasts: Array<ToastData> = $state([
    {
      message: "Welcome to Vivend'ia!",
      type: "info",
      duration: 3000,
    },
  ]);

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
</script>

{#if user === null}
  <LoginView bind:user />
{:else}
  <ConversationView {user} />
{/if}



<div class="absolute right-4 top-4 z-50">
  {#each toasts as toast}
    <Toast
      {toast}
      onclose={() => {
        toasts = toasts.filter((t) => t !== toast);
      }}
    />
  {/each}
</div>
