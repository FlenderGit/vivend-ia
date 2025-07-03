<script lang="ts">
  import { slide } from "svelte/transition";
  import { Conversation } from "./lib/classes";
  import ClickableIcon from "./lib/components/ui/ClickableIcon.svelte";
  import Sidebar from "./lib/components/ui/Sidebar.svelte";
  import MessageAreaView from "./lib/components/conversation/MessageAreaView.svelte";
  import type { ToastData } from "./lib/types";
  import Toast from "./lib/components/ui/Toast.svelte";
  import { onMount } from "svelte";
  import { fetchConversationsPreview } from "./lib/api/discussion";
  import Modal from "./lib/components/ui/Modal.svelte";

  let discussion: Conversation = $state(
    new Conversation({
      id: "1",
      title: "My First Conversation",
      icon: "lucide:message-circle",
      description: "This is a test discussion with some example messages.",
      timestamp: Date.now(),
      messages: [
        { role: "user", message: "Hello, how are you?" },
        { role: "assistant", message: "I'm fine, thank you!" },
        { role: "user", message: "What can you do?" },
        {
          role: "assistant",
          message:
            "I can help you with various tasks. Just let me know what you need! and I'll do my best to assist you. here are some examples of what I can do:",
        },
        {
          role: "assistant",
          message:
            "1. Answer questions\n2. Provide explanations\n3. Help with coding tasks\n4. Generate creative content",
        },
        { role: "user", message: "Can you write a poem?" },
        {
          role: "assistant",
          message:
            "Sure! Here's a short poem for you:\n\nRoses are red,\nViolets are blue,\nI'm here to assist,\nJust ask, and I'll help you!",
        },
      ],
    })
  );


  let toasts: Array<ToastData> = $state([
    {
      message: "Welcome to Vivend'ia!",
      type: "info",
      duration: 3000,
    },
  ]);

  let open = $state(false);

  async function onsubmit(event: Event) {
    event.preventDefault();
    const message = input_ref.value.trim();

    if (message) {
      await discussion.sendMessageToAi(message);
      input_ref.value = "";
      input_ref.focus();
    }
  }

  let input_ref: HTMLInputElement;

  function handleKeyDown(event: KeyboardEvent) {
    const isCtrlPress = event.ctrlKey || event.metaKey;
    const isFocusOnInput = document.activeElement === input_ref;
    if (event.key === "Enter" && !isFocusOnInput && isCtrlPress) {
      event.preventDefault();
      input_ref.focus();
    }
    if (isCtrlPress && event.key === "E") {
      event.preventDefault();
      open = !open;
    }
  }

  let u = $state(null);
  $inspect(u);
  onMount(async () => {
  chrome.identity.launchWebAuthFlow({
      url: "https://login.microsoftonline.com/c2c22d99-66d4-4a79-bd38-c1d09da67d49/oauth2/v2.0/authorize?client_id=5bb8917f-269c-40bf-9026-aa40aba84ed1&response_type=code&redirect_uri=https://www2.vivendi.com/authent/&scope=openid%20profile%20email&state=https://flhbjpococakgehhlagdbhejafobichg.chromiumapp.org/",
      interactive: true,
    }, (responseUrl) => {
      console.log("Auth response URL:", responseUrl);
      if (chrome.runtime.lastError) {
        console.error("Error during authentication:", chrome.runtime.lastError);
        return;
      }
    });
  // chrome.identity.getAuthToken({interactive: true})
  //   .then((token) => {
  //     console.log("Auth token:", token);
  //     fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  //   headers: {Authorization: `Bearer ${token.token}`}
  // }).then(j => j.json()).then(console.log);
  //     });

  //     chrome.identity.getProfileUserInfo({
  //     accountStatus: chrome.identity.AccountStatus.ANY,
  //   })
  //   .then((user) => {
  //     u = user;
  //     console.log("User info:", user);
  //   })
    const rest = await fetchConversationsPreview();
    console.log("Conversations preview:", rest);
  });

  let modalOpen = $state(false);
</script>

<svelte:window onkeydown={handleKeyDown} />


<Modal open={modalOpen}>
  {#snippet header()}
    <h2>Create new discussion</h2>
  {/snippet}
  <form>
    <p>Title & Icon & Feeling</p>
  </form>
</Modal>

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

<div class="flex h-screen bg-neutral-200">
  <Sidebar
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
      <MessageAreaView {discussion} class="flex-1 overflow-y-auto" />
      <section>
        <form {onsubmit}>
          <input
            aria-keyshortcuts="Ctrl+Enter"
            disabled={discussion.status === "pending"}
            type="text"
            placeholder="Type your message here..."
            class="w-full lshadow px-4 py-2 text-sm border bg-background-secondary border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
    </main>
  </div>
  <!-- <ConversationView class="flex-1" {discussion} {open} /> -->
</div>
