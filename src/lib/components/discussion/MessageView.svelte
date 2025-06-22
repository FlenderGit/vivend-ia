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
          onclickpromise={async () => {
            try {
              await navigator.clipboard.writeText(message.message);
            } catch (error) {
              return false;
            }
            return true;
          }}
        />
        <ClickableIcon
          icon="mingcute:share-3-line"
          title="Share message"
          onclickpromise={async () => {
            await navigator.share({
              title: "Shared Message",
              text: message.message,
              url: window.location.href,
            });
          }}
        />
        <ClickableIcon
          icon="mingcute:announcement-line"
          title="Play message"
          onclickpromise={async () => {
            // Wait 3sec
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }}
        />
      </footer>
    {/if}
  </div>
</article>
