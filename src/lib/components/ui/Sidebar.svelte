<script lang="ts">
  import { fade } from "svelte/transition";
  import type { HTMLAsideAttributes, User } from "../../types";
  import ClickableIcon from "./ClickableIcon.svelte";
  import ConversationPreview from "../conversation/ConversationPreview.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";
  import { fetchConversationsPreview } from "../../api";
  import { current_conversation_store } from "../../stores/current_conversation";

  type Props = {
    open?: boolean;
    user: User;
  } & HTMLAsideAttributes;

  let { open = $bindable(false), user, ...rest }: Props = $props();

  const { conversation, isLoading } = current_conversation_store;
  const selected_id = $derived($conversation?.id || null);
  let loading_id = $state<string | null>(null);
  let selected_dropdown_id = $state<string | null>(null);

  const conversations_promise = fetchConversationsPreview();
</script>

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
      {#await conversations_promise}
        <p>Loading...</p>
      {:then conversations_result}
        {#if conversations_result.isErr()}
          <div class="error">
            <p>Erreur: {conversations_result.error.message}</p>
          </div>
        {:else}
          <ul class="flex flex-col gap-2 font-semibold text-sm" role="list">
            {#each conversations_result.value as discussion (discussion.id)}
              <li
                transition:fade={{ duration: 300 }}
                class:animate-pulse={$isLoading && loading_id === discussion.id}
              >
                <ConversationPreview
                  preview={discussion}
                  is_selected={selected_id === discussion.id}
                  is_dropdown_down={selected_dropdown_id === discussion.id}
                  ondropdown_clicked={() => {
                    selected_dropdown_id =
                      selected_dropdown_id === discussion.id
                        ? null
                        : discussion.id;
                  }}
                  onclick={() => {
                    if (selected_id === discussion.id) return;
                    loading_id = discussion.id;
                    current_conversation_store
                      .loadNewConversation(discussion.id)
                      .finally(() => {
                        loading_id = null;
                      });
                  }}
                />
              </li>
            {:else}
              <li class="text-neutral-500">No conversations found.</li>
            {/each}
          </ul>
        {/if}
      {:catch error}
        <div class="error">
          <p>Erreur inattendue: {error.message}</p>
        </div>
      {/await}
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
