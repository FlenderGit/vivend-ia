<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { ConversationPreviewData } from "../../types";
  import ClickableIcon from "../ui/ClickableIcon.svelte";
  import createPopperAction from "../../actions/popper";
  import ConversationForm from "../form/ConversationForm.svelte";
  import Modal from "../ui/Modal.svelte";
  import ModalDeleteConversation from "./ModalDeleteConversation.svelte";

  type Props = {
    is_selected?: boolean;
    preview: ConversationPreviewData;
    is_dropdown_down?: boolean;
    onclick: () => void;
    ondropdown_clicked?: () => void;
    ondelete(): void;
  };

  let {
    preview = $bindable(),
    is_selected,
    is_dropdown_down,
    ondropdown_clicked,
    onclick,
    ondelete,
  }: Props = $props();

  let [usePopperElement, usePopperTooltip] = createPopperAction();

  let is_editing = $state(false);
  let is_deleting = $state(false);

  const actions = [
    {
      label: "Edit",
      icon: "mdi:pencil-outline",
      onclick: () => {
        is_editing = true;
      },
    },
    {
      label: "Pin",
      icon: "mdi:pin-outline",
    },
    {
      label: "Share",
      icon: "mdi:share-outline",
    },
    {
      label: "Delete",
      icon: "mdi:delete-outline",
      onclick: () => {
        is_deleting = true;
      },
    },
  ];
</script>

<button
  class={[
    is_selected && "bg-neutral-500/15",
    "box-border group w-full rounded-xl hover:bg-neutral-500/15 px-3 py-2 flex items-center justify-between gap-1 cursor-pointer transition-colors"
  ]}
  title={preview.title}
  role="tab"
  aria-selected={is_selected}
  tabindex="0"
  {onclick}
>
  <div class="flex items-center gap-2 min-w-0 flex-1">
    <!-- <Icon icon={preview.icon} class="size-6 shrink-0" /> -->
    <p class="truncate">{preview.title}</p>
  </div>
  <div use:usePopperElement>
    <ClickableIcon
      icon="mingcute:more-1-fill"
      title="Détails"
      class="{!is_selected && "hidden"} group-hover:block"
      onclick={(e) => {
        e.stopPropagation();
        ondropdown_clicked?.();
      }}
    />
  </div>
</button>
{#if is_dropdown_down}
  <div
    use:usePopperTooltip={{
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    }}
    class="p-2 bg-background rounded-xl shadow-lg border border-background-tertiary z-50 w-48"
  >
    <ul>
      {#each actions as action}
        <li>
          <button
            class="button hover:bg-background-secondary"
            onclick={(e) => {
              e.stopPropagation();
              action.onclick?.();
            }}
          >
            <Icon icon={action.icon} class="size-4" />
            <p class="text-sm">{action.label}</p>
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{#if is_editing}
  <Modal bind:open={is_editing}>
    {#snippet header()}
      <h2 class="text-lg font-semibold">Edit Conversation</h2>
    {/snippet}
    <ConversationForm
      conversation={preview}
      onSubmit={(new_conversation) => {
        preview = new_conversation;
        is_editing = false;
      }}
    />
  </Modal>
{/if}

{#if is_deleting}
  <ModalDeleteConversation
    bind:open={is_deleting}
    {preview}
    onDelete={() => {
      ondelete();
    }}
  />
{/if}
