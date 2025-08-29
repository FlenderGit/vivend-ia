<script lang="ts">
  import { fade } from "svelte/transition";
  import type { HTMLAsideAttributes } from "../../types";
  import ClickableIcon from "./ClickableIcon.svelte";
  import ProfilePicture from "./ProfilePicture.svelte";
  import { current_conversation_store } from "../../stores/current_conversation";
  import ConversationPreview from "../conversation/ConversationPreview.svelte";
  import { onMount } from "svelte";
  import { history_conversation_store } from "$lib/stores/conversation_history";
  import SettingModal from "../modal/SettingModal.svelte";
  import { user_store } from "$lib/stores/user";
  import Icon from "@iconify/svelte";
  import SearchModal from "../modal/SearchModal.svelte";
  import { t } from "$lib/utils/i18n";
    import { authenticator } from "$lib/utils/auth";

  type Props = {
    open?: boolean;
    onclose?: () => void;
  } & HTMLAsideAttributes;

  let { open = $bindable(false), onclose, ...rest }: Props = $props();
  //
  const { conversation, isLoading, error } = current_conversation_store;
  const selected_id = $derived($conversation?.id || null);

  let loading_id = $state<string | null>(null);
  let selected_dropdown_id = $state<string | null>(null);

  let { isLoading: isConversationsLoading, conversations } =
    history_conversation_store;

  // const conversationRequest = useApi(fetchConversationsPreview);
  onMount(() => {
    history_conversation_store.fetchConversations();
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

  let is_editing = $state(false);
  let is_searching = $state(false);
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
  class="absolute z-40 top-0 bottom-0 bg-background-secondary inset-0 md:z-20 sm:w-64 pt-12 md:pt-4 px-4 pb-4 duration-500 transition-[opacity,transform,translate] grid grid-rows-[auto_1fr_auto]"
  class:translate-x-[-100%]={!open}
  class:translate-x-0={open}
  class:opacity-0={!open}
  {...rest}
>
  <div class="font-semibold text-sm">
    <button
      class="button hover:bg-neutral-300"
      onclick={() => {
        current_conversation_store.loadDefaultConversation();
      }}
    >
      <Icon icon="mingcute:edit-line" class="size-5" />
      {t("nav_new_conversation")}
    </button>
    <button
      class="button hover:bg-neutral-300"
      onclick={() => {
        is_searching = true;
      }}
    >
      <Icon icon="mingcute:search-2-line" class="size-5" />
      {t("nav_search")}
    </button>
  </div>

  <nav class="w-full overflow-y-auto text-sm">
    <h2 class="my-4 text-sm opacity-50">
      {t("nav_previous_chat")}
    </h2>
    {#if $isConversationsLoading}
      <p>{t("ui_loading")}</p>
    {:else if $error}
      <div class="error">
        <p>{$error.message}</p>
      </div>
    {:else if $conversations}
      <ul class="flex flex-col gap-2" role="list">
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
                  selected_dropdown_id === discussion.id ? null : discussion.id;
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
                  onclose?.();

              }}
            />
          </li>
        {:else}
          <li class="opacity-50 italic">{t("no_conversations")}</li>
        {/each}
      </ul>
    {:else}
      <div class="error">
        <p>Erreur inattendue</p>
      </div>
    {/if}
  </nav>
  <div class="items-center gap-2 grid grid-cols-[auto_1fr_auto]">
    {#if $user_store === null}
      <p>{t("error_unlogged")}</p>
    {:else}
      <ProfilePicture user={$user_store} />
      <div class="flex flex-col min-w-0">
        <p class="truncate text-sm" title={$user_store.name}>{$user_store.name}</p>
        <span class="truncate text-xs text-neutral-500" title={$user_store.email}>{$user_store.email}</span>
      </div>
    {/if}
    <div class="flex items-center gap-1">
      <ClickableIcon
        icon="mdi:settings"
        title={t("ui_settings")}
        onclick={() => {
          is_editing = true;
        }}
      />
      <ClickableIcon
        icon="mdi:logout"
        title={t("ui_logout")}
        onclick={() => {
          authenticator.clear_token().andTee((t) => {
            user_store.set(null);
            // current_conversation_store.clear();
            // history_conversation_store.clear();
          });
        }}
      />
    </div>
  </div>
</aside>

<SettingModal bind:open={is_editing} />
<SearchModal bind:open={is_searching} />
