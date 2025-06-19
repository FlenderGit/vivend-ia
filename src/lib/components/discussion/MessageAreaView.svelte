<script lang="ts">
  import { tick } from "svelte";
  import MessageView from "./MessageView.svelte";
  import type { Discussion } from "../../classes";

  type Props = {
    discussion: Discussion;
  };

  const { discussion }: Props = $props();

  let viewport: HTMLElement;


  $effect.pre(() => {
    discussion.messageCount;

    if (!viewport || length) return;
    const needAutoscroll =
      viewport &&
      viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 150;

    if (needAutoscroll) {
      tick().then(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  });
</script>

<div class="overflow-y-auto p-4 flex flex-col gap-3" bind:this={viewport}>
  {#each discussion.messages as message}
    <MessageView {message} />
  {/each}
</div>
