<script lang="ts">
  import { history_conversation_store } from "$lib/stores/conversation_history";
    import { current_conversation_store } from "$lib/stores/current_conversation";
  import Modal from "../ui/Modal.svelte";

  type Props = {
    open?: boolean;
  };

  const { conversations } = history_conversation_store;
  const filtered_conversations = $derived(
    $conversations.filter((conversation) => conversation.title.includes(query)),
  );

  function highlightText(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="bg-yellow-200">$1</span>`);
  }

  let query = $state("");

  let { open = $bindable(false) }: Props = $props();
</script>

<Modal bind:open>
  {#snippet header()}
    <h2 class="text-lg font-semibold">Search</h2>
  {/snippet}

  <div class="p-4">
    <input
      type="text"
      placeholder="Search..."
      class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      bind:value={query}
    />
  </div>

  <div class="p-4 flex flex-col gap-2">
    {#each filtered_conversations as conversation (conversation.id)}
      <button onclick={() => {
        current_conversation_store.loadNewConversation(conversation.id);
        open = false;
      }}>
        {@html highlightText(conversation.title, query)}
      </button>
    {:else}
      <p class="text-gray-500">No results found</p>
    {/each}
  </div>
</Modal>
