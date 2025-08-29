<script lang="ts">
    import type { ResponseItemUser } from "$lib/types/openai";

    type Props = {
        message: ResponseItemUser;
    }

    const {message}: Props = $props();
</script>


{#each message.message.content as content}
    {#if content.type === "input_text"}
        <div class="p-2 rounded-lg bg-primary/20">
            <p>{content.text}</p>
        </div>
    {:else}
        <p>{content.type} not supported</p>
    {/if}
{/each}