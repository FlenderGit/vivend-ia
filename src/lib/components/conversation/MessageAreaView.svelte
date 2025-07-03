<script lang="ts">
  import { tick } from "svelte";
  import MessageView from "./MessageView.svelte";
  import type { Conversation } from "../../classes";
  import type { HTMLSectionAttributes } from "../../types";

  type Props = {
    discussion: Conversation;
  } & HTMLSectionAttributes;

  const { discussion, class: classData, ...rest }: Props = $props();

  let viewport: HTMLSectionAttributes;

  $effect.pre(() => {
    discussion.messageCount;
    discussion.bufferMessage.length;

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

  <div
    class="animate-pulse  min-h-16 rounded-lg flex-shrink-0 text-sm px-3 pb-3 mt-3 text-text-light mb-8 transition-colors duration-500"
    class:hidden={discussion.status !== "pending" && discussion.status !== "writing"}
    class:bg-neutral-200={discussion.status === "pending"}
    class:my-2={discussion.status === "pending"}
  >
    {#each discussion.bufferMessage as msg }
      <span class="animate-typing">{msg + " "}</span>
    {/each}
  </div>
</section>
