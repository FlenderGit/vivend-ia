<script lang="ts">
  import { tick } from "svelte";
  import MessageView from "./MessageView.svelte";
  import type { Discussion } from "../../classes";
  import type { HTMLSectionAttributes } from "../../types";

  type Props = {
    discussion: Discussion;
  } & HTMLSectionAttributes;

  const { discussion, class: classData, ...rest }: Props = $props();

  let viewport: HTMLSectionAttributes;

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

<section
  class="flex flex-col {classData} pt-6"
  bind:this={viewport}
  {...rest}
  aria-live="polite"
  role="log"
  aria-label="Zone de discussion avec la conversation {discussion.title}"
>
  <div class="flex items-center gap-2">
    <time
      class="text-sm text-text font-semibold"
      datetime={new Date().toISOString()}
    >
      Aujourd'hui
    </time>
    <hr class="w-full text-neutral-300" />
  </div>

  {#each discussion.messages as message}
    <MessageView {message} />
  {/each}

  {#if discussion.status === "pending"}{/if}
  <div
    class="bg-neutral-200 animate-pulse h-24 rounded-lg flex-shrink-0"
    class:hidden={discussion.status !== "pending"}
  ></div>
</section>
