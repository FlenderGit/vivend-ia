<script lang="ts">
  import { slide } from "svelte/transition";
  import ClickableIcon from "../components/ui/ClickableIcon.svelte";
  import Modal from "../components/ui/Modal.svelte";
  import Sidebar from "../components/ui/Sidebar.svelte";
  import MessageAreaView from "../components/conversation/MessageAreaView.svelte";
  import type { User } from "../types";
  import { current_conversation_store } from "../stores/current_conversation";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  type Props = {
    user: User;
  };
  const { user }: Props = $props();

  const { conversation, isLoading, error } = current_conversation_store;

  let open = $state(false);

  async function onsubmit(event: Event) {
    event.preventDefault();
    if (input_ref === null) return;
    if (!$conversation) {
      console.error("No conversation available");
      return;
    }
    const message = input_ref.value.trim();

    if (message) {
      await $conversation.sendMessageToAi(message);
      input_ref.value = "";
      input_ref.focus();
    }
  }

  let input_ref: HTMLInputElement | null = $state(null);

  function handleKeyDown(event: KeyboardEvent) {
    const isCtrlPress = event.ctrlKey || event.metaKey;
    const isFocusOnInput = document.activeElement === input_ref;
    if (event.key === "Enter" && !isFocusOnInput && isCtrlPress) {
      event.preventDefault();
      input_ref?.focus();
    }
    if (isCtrlPress && event.key === "E") {
      event.preventDefault();
      open = !open;
    }
  }

  onMount(() => {
    current_conversation_store.loadNewConversation("2");

  });

  let modalOpen = $state(false);
</script>

<svelte:window onkeydown={handleKeyDown} />


<Modal bind:open={modalOpen}>
  {#snippet header()}
    <h2>Create new discussion</h2>
  {/snippet}
  <form>
    <p>Title & Icon & Feeling</p>
  </form>
</Modal>
<h1 class="sr-only">Vivend'ia</h1>
<a href="#main-content" class="sr-only"> Skip to main content </a>

<header class="flex gap-2 p-2 z-50 fixed">
  <ClickableIcon
    title="Précédentes conversations"
    icon="mingcute:align-left-line"
    onclick={() => (open = !open)}
  />
  <ClickableIcon
    title="Nouvele conversation"
    icon="mingcute:edit-line"
    onclick={() => {
      // discussion = Conversation.new();
      modalOpen = true;
    }}
  />
</header>

<!-- <ThemeForm /> -->

<div class="flex h-screen bg-neutral-200">
  <Sidebar
    {user}
    aria-label="Liste des précédentes conversations"
    aria-keyshortcuts="Ctrl+E"
    bind:open
  />
  {#if open}
    <div transition:slide={{ axis: "x", duration: 400 }} class="sm:w-64"></div>
  {/if}
  <div
    class="flex-1 flex flex-col transition-all duration-500 {open && 'sm:p-3'}"
  >
    <main
      id="main-content"
      class="lshadow overflow-y-auto z-30 bg-background flex flex-col gap-2 flex-1 p-3 duration-500 transition-all {open &&
        'sm:rounded-xl'}"
    >
      {#if $isLoading}
        <Icon icon="line-md:loading-loop" class="animate-spin m-auto text-4xl opacity-75" />
      {:else if $error}
        <p class="text-red-500 opacity-75 m-auto">Erreur: {$error.message}</p>
      {:else if $conversation}
        <MessageAreaView discussion={$conversation} class="flex-1 overflow-y-auto" />
        <section>
          <form {onsubmit}>
            <input
              aria-keyshortcuts="Ctrl+Enter"
              disabled={$conversation.status === "pending"}
              type="text"
              placeholder="Type your message here..."
              class="input lshadow"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              bind:this={input_ref}
              aria-label="Type your message"
              aria-describedby="input-hint"
            />
            <small class="text-xs sr-only" id="input-hint">
              Press Enter to send your message.
            </small>
          </form>
        </section>
      {:else}
        <p class="text-gray-500">No conversation selected.</p>
      {/if}
    </main>
  </div>
  <!-- <ConversationView class="flex-1" {discussion} {open} /> -->
</div>
