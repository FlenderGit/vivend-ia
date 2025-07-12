<script lang="ts">
  import Toast from "./lib/components/ui/Toast.svelte";
  import LoginView from "./lib/view/LoginView.svelte";
  import ConversationView from "./lib/view/ConversationView.svelte";
  import { onMount } from "svelte";
  import { toasts_store } from "./lib/stores/toasts";
  import { user_store } from "$lib/stores/user";

  onMount(() => {
    if (import.meta.env.DEV) {
      $user_store = {
        id: "1",
        name: "John Doe",
        email: "john.doe@me.com",
      };
    } else {
      chrome.storage.local.get(["user"], (result) => {
        if (result.user) {
          $user_store = result.user;
        }
      });
    }
  });

  // $effect(() => {
  //   console.log("Theme store updated:", $theme_store);
  //   Object.entries($theme_store).forEach(([key, value]) => {
  //     console.log(`Setting CSS variable --color-${key} to ${value}`);
  //     document.documentElement.style.setProperty(`--color-${key}`, value);
  //   });
  // });
</script>

<svelte:head>
  <title>{ __APP_NAME__ }</title>
</svelte:head>

<!-- <button onclick={() => {
  sendMessageToConversation("1", "Hello, world!");
}}>
  Test
</button> -->

{#if $user_store === null}
  <LoginView />
{:else}
  <ConversationView />
{/if}

<div class="absolute right-4 top-4 z-50">
  {#each $toasts_store as toast}
    <Toast
      {toast}
      onclose={() => {
        toasts_store.removeToast(toast.id);
      }}
    />
  {/each}
</div>
