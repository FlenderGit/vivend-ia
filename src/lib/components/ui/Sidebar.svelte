<script lang="ts">
  import { fade } from "svelte/transition";
  import type { HTMLAsideAttributes, User } from "../../types";
  import ClickableIcon from "./ClickableIcon.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";
  import { fetchConversationsPreview } from "../../api";
  import { current_conversation_store } from "../../stores/current_conversation";
  import ConversationPreview from "../conversation/ConversationPreview.svelte";
  import { onMount } from "svelte";
  import { history_conversation_store } from "$lib/stores/conversation_history";

  type Props = {
    open?: boolean;
    user: User;
  } & HTMLAsideAttributes;

  let { open = $bindable(false), user, ...rest }: Props = $props();

  const { conversation, isLoading } = current_conversation_store;
  const selected_id = $derived($conversation?.id || null);

  let loading_id = $state<string | null>(null);
  let selected_dropdown_id = $state<string | null>(null);

  let { isLoading: isConversationsLoading, conversations } =
    history_conversation_store;

  // const conversationRequest = useApi(fetchConversationsPreview);
  onMount(() => {
    fetchConversationsPreview().match(
      (data) => {
        history_conversation_store.setConversations(data);
      },
      (error) => {
        console.error("Failed to fetch conversations:", error);
      }
    );
  });

  function loadNewConversationLinked(id: string) {
    loading_id = id;
    current_conversation_store
      .loadNewConversation(id)
      .then(() => {
        // If on small screen, clone the sidebar
        if (window.innerWidth <= 640) {
          open = false;
        }
      })
      .finally(() => {
        loading_id = null;
      });
  }

  // Close the dropdown when clicking outside of it
  function handleGlobalClickCloseDropdown() {
    if (selected_dropdown_id) {
      selected_dropdown_id = null;
    }
  }
</script>

<svelte:window
  on:click={handleGlobalClickCloseDropdown}
  on:keydown={(e) => {
    if (e.key === "Escape") {
      selected_dropdown_id = null;
    }
  }}
/>

<aside
  class="absolute z-40 sm:z-20 bg-neutral-200 sm:w-64 pt-12 p-4 inset-0 duration-500 transition-[opacity,transform,translate] flex flex-col gap-4 justify-between"
  class:translate-x-[-100%]={!open}
  class:translate-x-0={open}
  class:opacity-0={!open}
  {...rest}
>
  <div>
    <h2>Conversations</h2>
    <nav>
      {#if $isConversationsLoading}
        <p>Loading...</p>
      {:else if false}
        <div class="error">
          <p>Erreur: TD</p>
        </div>
      {:else if $conversations}
        <ul class="flex flex-col gap-2 font-semibold text-sm" role="list">
          {#each $conversations as discussion, i (discussion.id)}
            <li
              transition:fade={{ duration: 300 }}
              class:animate-pulse={$isLoading && loading_id === discussion.id}
            >
              <ConversationPreview
                bind:preview={$conversations[i]}
                is_selected={selected_id === discussion.id}
                is_dropdown_down={selected_dropdown_id === discussion.id}
                ondropdown_clicked={() => {
                  selected_dropdown_id =
                    selected_dropdown_id === discussion.id
                      ? null
                      : discussion.id;
                }}
                ondelete={() => {
                  if (discussion.id === discussion.id) {
                    const new_id = $conversations[i + 1]?.id || "exemple";
                    loadNewConversationLinked(new_id);
                  }

                  history_conversation_store.removeConversation(discussion.id);
                }}
                onclick={() => {
                  if (selected_id === discussion.id) return;
                  loadNewConversationLinked(discussion.id);
                }}
              />
            </li>
          {:else}
            <li class="text-neutral-500">No conversations found.</li>
          {/each}
        </ul>
      {:else}
        <div class="error">
          <p>Erreur inattendue</p>
        </div>
      {/if}
    </nav>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <ProfilePicture {user} />
      <div class="flex flex-col">
        <p title={user.email}>{user.name}</p>
        <span class="text-xs text-neutral-500">{user.email}</span>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <ClickableIcon icon="mdi:settings" />
      <ClickableIcon icon="mdi:logout" />
    </div>
  </div>
</aside>
