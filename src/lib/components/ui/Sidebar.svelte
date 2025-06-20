<script lang="ts">
  import { fade } from "svelte/transition";
  import type { DiscussionPreviewData } from "../../types";
  import ClickableIcon from "./ClickableIcon.svelte";
  import Icon from "@iconify/svelte";

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();
  let discussions: Array<DiscussionPreviewData> = $state([
    {
      id: "1",
      title: "Discussion 1",
      description: "This is a test description. That is a test description.",
      icon: "fluent-color:calendar-edit-16",
      timestamp: 1750231897,
    },
    {
      id: "2",
      title: "Discussion 2",
      description: "Test",
      icon: "fluent-color:lightbulb-filament-16",
      timestamp: 1750230897,
    },
    {
      id: "3",
      title: "Discussion 3",
      description: "Test",
      icon: "fluent-color:chat-16",
      timestamp: 1750201897,
    },
    {
      id: "4",
      title: "Discussion 4",
      description: "Test",
      icon: "fluent-color:animal-paw-print-16",
      timestamp: 1750031897,
    },
  ]);
</script>

<aside
  class="absolute z-40 sm:z-20 bg-neutral-200 sm:w-72 pt-12 p-4 inset-0 duration-500 transition-[opacity,transform,translate]"
  class:translate-x-[-100%]={!open}
  class:translate-x-0={open}
  class:opacity-0={!open}
  aria-label="Liste des précédentes conversations"
>
  <h2>Conversations</h2>
  <nav>
    <ul class="flex flex-col gap-2 font-semibold text-sm" role="list">
      {#each discussions as discussion (discussion.id)}
        <li
          transition:fade={{ duration: 300 }}
          class="rounded-xl hover:bg-neutral-300 px-3 py-1 flex items-center justify-between gap-1"
        >
          <div class="flex items-center gap-2" role="tab" aria-selected="false">
            <Icon icon={discussion.icon} />
            <p>{discussion.title}</p>
          </div>
          <ClickableIcon icon="mingcute:settings-5-line" title="Edit discussion" />
        </li>
      {/each}
    </ul>
  </nav>
</aside>
