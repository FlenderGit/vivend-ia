<script lang="ts">
  import { fade } from "svelte/transition";
  import type { ConversationPreviewData, HTMLAsideAttributes } from "../../types";
  import ClickableIcon from "./ClickableIcon.svelte";
  import Icon from "@iconify/svelte";
  import createPopperAction from "../../actions/popper";
  import ConversationPreview from "../conversation/ConversationPreview.svelte";

  type Props = {
    open?: boolean;
  } & HTMLAsideAttributes;

  let { open = $bindable(false), ...rest }: Props = $props();
  let selected_id = $state<string | null>("1");
  let selected_dropdown_id = $state<string | null>(null);
  let discussions: Array<ConversationPreviewData> = $state([
    {
      id: "1",
      title: "Conversation 1 - A very long title that should be truncated",
      description: "This is a test description. That is a test description.",
      icon: "fluent-color:calendar-edit-16",
      timestamp: 1750231897,
    },
    {
      id: "2",
      title: "Conversation 2",
      description: "Test",
      icon: "fluent-color:lightbulb-filament-16",
      timestamp: 1750230897,
    },
    {
      id: "3",
      title: "Conversation 3",
      description: "Test",
      icon: "fluent-color:chat-16",
      timestamp: 1750201897,
    },
    {
      id: "4",
      title: "Conversation 4",
      description: "Test",
      icon: "fluent-color:animal-paw-print-16",
      timestamp: 1750031897,
    },
  ]);
</script>

<aside
  class="absolute z-40 sm:z-20 bg-neutral-200 sm:w-64 pt-12 p-4 inset-0 duration-500 transition-[opacity,transform,translate]"
  class:translate-x-[-100%]={!open}
  class:translate-x-0={open}
  class:opacity-0={!open}
  {...rest}
>
  <h2>Conversations</h2>
  <nav>
    <ul class="flex flex-col gap-2 font-semibold text-sm" role="list">
      {#each discussions as discussion (discussion.id)}
        <li
          transition:fade={{ duration: 300 }}
          class=""
        >
          <ConversationPreview
            preview={discussion}
            is_selected={selected_id === discussion.id}
            is_dropdown_down={selected_dropdown_id === discussion.id}
            ondropdown_clicked={() => {
              selected_dropdown_id =
                selected_dropdown_id === discussion.id ? null : discussion.id;
            }}
          />
        </li>
      {/each}
    </ul>
  </nav>
</aside>
