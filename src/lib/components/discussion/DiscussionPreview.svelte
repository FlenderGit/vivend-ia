<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { DiscussionPreviewData } from "../../types";
  import { timestampToHour } from "../../utils";

  type Props = {
    preview: DiscussionPreviewData;
  };

  let { preview }: Props = $props();
</script>

{#snippet IconPreview(icon: string)}
  <div
    class="size-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-assistant to-slate-100"
  >
    <Icon {icon} class="text-3xl" />
  </div>
{/snippet}

<button
  class="flash relative bg-background hover:bg-background-secondary not-dark:hover:shadow-md flex gap-2 border border-border rounded-xl p-3 transition-all hover:-translate-y-0.5 min-w-0"
>
  {@render IconPreview(preview.icon)}
  <div class="flex-1 flex flex-col justify-around text-left min-w-0">
    <p class="font-semibold">{preview.title}</p>
    <p class="text-sm text-text-light truncate">{preview.description}</p>
  </div>
  <div class="flex flex-col justify-center flex-shrink-0">
    <p class="text-xs text-text-light">{timestampToHour(preview.timestamp)}</p>
  </div>
</button>
