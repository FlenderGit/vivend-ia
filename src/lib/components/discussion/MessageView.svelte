<script lang="ts">
  import type { MessageData } from "../../types";
  import ClickableIcon from "../ui/ClickableIcon.svelte";

  type Props = {
    message: MessageData;
  };

  const { message }: Props = $props();
  const isUserMessage = message.role === "user";

  const messageClass = isUserMessage ? "bg-user rounded-xl" : "";
</script>

<article class="flex {isUserMessage ? 'justify-end' : 'justify-start'}">
  <div class="p-3 {messageClass}">
    <p class="text-sm whitespace-pre-wrap">{message.message}</p>
    {#if !isUserMessage}
      <footer class="mt-2 flex gap-2">
        <ClickableIcon
          icon="mingcute:copy-line"
          title="Copy message"
          onclick={() => navigator.clipboard.writeText(message.message)}
        />
        <ClickableIcon
          icon="mingcute:share-3-line"
          title="Share message"
          onclick={() => {
            navigator
              .share({
              title: "Shared Message",
              text: message.message,
              url: window.location.href,
            }).catch((error) => console.error("Error sharing:", error));
          }}
        />
        <ClickableIcon
          icon="mingcute:announcement-line"
          title="Play message"
          onclick={() => {
            console.log("Report message clicked");
          }}
        />
      </footer>
    {/if}
  </div>
</article>
