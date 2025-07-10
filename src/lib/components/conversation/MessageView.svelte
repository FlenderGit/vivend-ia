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
            if (!("speechSynthesis" in window)) {
              throw new Error("Speech Synthesis non supportée");
            }

            if(speechSynthesis.getVoices().length === 0) {
              // Load voices if not already loaded
              await new Promise((resolve) => {
                speechSynthesis.onvoiceschanged = resolve;
              });
            }

            // Attendre que l'API soit prête
            if (speechSynthesis.pending || speechSynthesis.speaking) {
              speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(message.message);
            utterance.lang = "en-US";
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            // Set a voice if available
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
              utterance.voice = voices[2]; // Use the first available voice
            }
            // Wait for the speech to finish
            speechSynthesis.speak(utterance);
            await new Promise((resolve) => {
              utterance.onend = resolve;
            });
          }}
        />
      </footer>
    {/if}
  </div>
</article>
