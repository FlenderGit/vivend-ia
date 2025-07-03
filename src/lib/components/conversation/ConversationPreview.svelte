<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { ConversationPreviewData } from "../../types";
  import ClickableIcon from "../ui/ClickableIcon.svelte";
  import createPopperAction from "../../actions/popper";

  type Props = {
    is_selected?: boolean;
    preview: ConversationPreviewData;
    is_dropdown_down?: boolean;
    ondropdown_clicked?: () => void;
  };

  let { preview, is_selected, is_dropdown_down, ondropdown_clicked }: Props =
    $props();

  let [usePopperElement, usePopperTooltip] = createPopperAction();

  const actions = [
    {
      label: "Share",
      icon: "mingcute:share-2-line",
    },
    {
      label: "Delete",
      icon: "mingcute:delete-2-line",
    },
  ];
</script>

<div
  class="rounded-xl hover:bg-neutral-300 px-3 py-1 flex items-center justify-between gap-1 cursor-pointer"
  title={preview.title}
  class:bg-neutral-300={is_selected}
  role="tab"
  aria-selected={is_selected}
  tabindex="0"
>
  <div class="flex items-center gap-2 min-w-0 flex-1">
    <Icon icon={preview.icon} class="size-6 shrink-0" />
    <p class="truncate">{preview.title}</p>
  </div>
  <div use:usePopperElement>
    <ClickableIcon
      icon="mingcute:more-1-fill"
      title="Details"
      onclick={() => {
        ondropdown_clicked?.();
      }}
    />
  </div>
</div>
{#if is_dropdown_down}
  <div
    use:usePopperTooltip={{
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    }}
    class="p-2 bg-neutral-100 rounded shadow-lg border border-neutral-300 z-50"
  >
    <ul>
      {#each actions as action}
        <li
          class="flex items-center gap-2 p-1 hover:bg-neutral-200 rounded cursor-pointer"
        >
          <Icon icon={action.icon} class="size-4" />
          <p class="text-sm">{action.label}</p>
        </li>
      {/each}
    </ul>
  </div>
{/if}
