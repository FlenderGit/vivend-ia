<script lang="ts">
  import { deleteConversation } from "$lib/api/conversation";
  import { toasts_store } from "$lib/stores/toasts";
  import type { ConversationPreviewData } from "$lib/types";
  import Icon from "@iconify/svelte";
  import Modal from "../ui/Modal.svelte";

  type Props = {
    open: boolean;
    preview: ConversationPreviewData;
    onDelete: () => void;
  };

  let { open = $bindable(), preview, onDelete }: Props = $props();
  let is_deleting = $state(false);
</script>

<Modal bind:open>
  {#snippet header()}
    <h2 class="text-lg font-semibold">Delete Conversation</h2>
  {/snippet}
  <p class="text-sm text-neutral-700">
    Are you sure you want to delete the conversation "{preview.title}"? This
    action cannot be undone.
  </p>
  <div class="flex justify-end gap-2 mt-4">
    <button
      class="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger"
      onclick={() => {
        is_deleting = true;
        deleteConversation(preview.id)
          .match(
            () => {
              toasts_store.addToast({
                type: "success",
                message: `Conversation "${preview.title}" deleted successfully.`,
                duration: 3000,
              });
              onDelete();
            },
            (error) => {
              toasts_store.addToast({
                type: "error",
                message: `Failed to delete conversation: ${error.message}`,
                duration: 5000,
              });
            }
          )
          .finally(() => {
            open = false;
            is_deleting = false;
          });
      }}
    >
      {#if is_deleting}
        <Icon icon="line-md:loading-loop" class="animate-spin m-auto text-xl opacity-75" />
      {:else}
        Delete
      {/if}
    </button>
    <button
      class="px-4 py-2 bg-neutral-300 rounded-lg hover:bg-neutral-400"
      onclick={() => {
        open = false;
      }}
    >
      Cancel
    </button>
  </div>
</Modal>
