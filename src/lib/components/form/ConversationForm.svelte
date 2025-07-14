<script lang="ts">
  import { updateConversation } from "$lib/api/conversation";
  import { toasts_store } from "$lib/stores/toasts";
  import type { ConversationPreviewData } from "../../types";
  import Input from "../Input.svelte";

  type Props = {
    conversation: ConversationPreviewData;
    onSubmit: (conversation: ConversationPreviewData) => void;
  };

  let { conversation, onSubmit }: Props = $props();
  let new_conversation: ConversationPreviewData = {
    ...conversation,
  };

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Send and handle HTTP request to save the conversation
    updateConversation(conversation.id, new_conversation).match(
      () => {
        toasts_store.addToast({
          type: "success",
          message: `Conversation "${new_conversation.title}" updated successfully.`,
          duration: 3000,
        });
        onSubmit(new_conversation);
      },
      (error) => {
        toasts_store.addToast({
          type: "error",
          message: `Failed to update conversation: ${error.message}`,
          duration: 5000,
        });
        console.error("Failed to update conversation:", error);
      }
    );
  }
</script>

<form onsubmit={handleSubmit} class="flex flex-col">
  <label class="label">
    Title
    <Input
      size="small"
      type="text"
      bind:value={new_conversation.title}
      placeholder="Enter conversation title"
      class="input"
    />
  </label>
  <!-- <label class="label">
    Icon
    <Input
      type="text"
      size="small"
      bind:value={new_conversation.icon}
      placeholder="Enter conversation icon"
      class="input"
    />
  </label> -->

  <button type="submit" class=""> Save </button>
</form>
