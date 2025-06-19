<script lang="ts">
  import { fade, fly, slide } from "svelte/transition";
  import { Discussion } from "./lib/classes";
  import DiscussionView from "./lib/view/DiscussionView.svelte";
  import HomeView from "./lib/view/HomeView.svelte";
  import { onMount } from "svelte";

  const discussion: Discussion = new Discussion({
    id: "1",
    title: "My First Discussion",
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
  });

  onMount(() => {
    const i = setInterval(() => (open = !open), 4000);
    return () => clearInterval(i);
  });

  let open = $state(false);
</script>

<!-- <button onclick={() => open = !open} class="fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded">
  Toggle Sidebar ({open ? "Close" : "Open"})
</button> -->

<!-- <Sidebar bind:open /> -->

{#if !open}
  <div transition:fly={{ duration: 3000, x: -100 }}>
    <HomeView />
  </div>
{:else}
    <DiscussionView {discussion} />
{/if}
<!-- <HomeView /> -->

<!-- <main class="h-screen grid grid-rows-[auto_1fr_auto]">
  <Topbar>
    <Icon icon="lucide:arrow-down"></Icon>
    <Icon icon={discussion.icon} class="text-2xl" />
    <h1 class="text-lg">MyChat</h1>
  </Topbar>
  <MessageAreaView {discussion} />
  <Input onsubmit={value => {
    discussion.addMessage(value, "user");
    discussion.addMessage("This is a placeholder response.", "assistant");
  }} />
</main> -->
