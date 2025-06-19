<script lang="ts">
  import type { MessageData } from "$lib/types";

  type Props = {
    message: MessageData;
  };

  const { message }: Props = $props();
  const isUserMessage = message.role === "user";

  const messageClass = isUserMessage ? "bg-user" : "bg-assistant";
</script>

<div class="flex { isUserMessage ? 'justify-end' : 'justify-start'}">
    <div class="p-2 rounded-md {messageClass} max-w-5/6">
        <p class="text-sm whitespace-pre-wrap break-all">{message.message}</p>
    </div>
</div>
