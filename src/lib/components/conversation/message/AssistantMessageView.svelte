<script lang="ts">
    import ClickableIcon from "$lib/components/ui/ClickableIcon.svelte";
    import type { ResponseItemAssistant } from "$lib/types/openai";
    import { snake_to_title } from "$lib/utils";
    import { get_marked } from "$lib/utils/marked";
    import Icon from "@iconify/svelte";

    type Props = {
        message: ResponseItemAssistant;
    };

    const { message }: Props = $props();

    let open_reasoning = $state(false);

    export function simpleSlideBlur(node, {
  duration = 400,
  delay = 0,
  blur = 5
} = {}) {
  const height = node.offsetHeight;
  
  return {
    delay,
    duration,
    css: (t) => `
      overflow: hidden;
      height: ${t * height}px;
      opacity: ${t};
      filter: blur(${(1 - t) * blur}px);
    `
  };
}

const text_content = $derived(message.message?.content.map(content => content.type === "output_text" ? content.text : content.refusal).join("\n") ?? "");

</script>

<div class="flex flex-col gap-1">

    <p class="sr-only">L'assistant à dit:</p>
    <div>
        {#if message.reasoning && message.reasoning.length > 0}
            <button onclick={() => open_reasoning = !open_reasoning} class="flex gap-1 items-center text-sm text-text-light">
                <Icon icon="mingcute:brain-line" />
                {#if open_reasoning} Hide Reasoning {:else} Show Reasoning {/if}
            </button>
        {/if}
        {#if open_reasoning}
            <div transition:simpleSlideBlur={{ duration: 300, blur: 1 }}>
                {#each message.reasoning ?? [] as reasoning}
                    {#if reasoning.type === "function_call"}
                        {@const args = JSON.parse(reasoning.arguments || "{}")}
                        <div>
                            <div class="flex gap-1 items-center">
                                <Icon icon="mingcute:code-line" class="flex-shrink-0" />
                                <p>{snake_to_title(reasoning.name)}</p>
                            </div>
                            {#if Object.keys(args).length > 0}
                                <p>Paramètres:</p>
                                    <code>{JSON.stringify(args, null, 2)}</code>
                            {/if}
                        </div>
                    {:else}
                        <p>{reasoning.type} not supported</p>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>

    <div class="">
        {#each message.message?.content ?? [] as content}
            {#if content.type === "output_text"}
                {#await get_marked().parse(content.text) then html}
                    {@html html}
                {/await}
            {:else}
                <p>Refusal</p>
            {/if}
        {/each}
    </div>

    {#if text_content !== ""}
        <footer class="flex gap-2">
            <ClickableIcon
                icon="mingcute:copy-line"
                title="Copy message"
                popper={true}
                onclickpromise={async () => {
                try {
                    await navigator.clipboard.writeText(text_content);
                } catch (error) {
                    return false;
                }
                return true;
                }}
            />
            <ClickableIcon
                icon="mingcute:share-3-line"
                title="Share message"
                popper={true}
                onclickpromise={async () => {
                await navigator.share({
                    title: "Shared Message",
                    text: text_content,
                    // url: window.location.href,
                });
                }}
            />
            <ClickableIcon
                icon="mingcute:announcement-line"
                title="Play message"
                popper={true}
                onclickpromise={async () => {

                console.log('Using Chrome TTS API to speak the message.');
                chrome.tts.speak(text_content, {
                    lang: chrome.i18n.getUILanguage() || 'en-US',
                    rate: 1.0,
                    pitch: 1.0,
                    volume: 1.0,
                    onEvent: (event) => {
                        if (event.type === 'end' || event.type === 'error') {
                            console.log('TTS event:', event.type);
                        }
                    }

                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('TTS failed to start');
                    }
                });
            }}
            />
        </footer>
    {/if}
</div>
