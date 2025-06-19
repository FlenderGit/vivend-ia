<script lang="ts">
  import Icon from "@iconify/svelte";
  import DiscussionPreview from "../components/discussion/DiscussionPreview.svelte";
  import type { DiscussionPreviewData } from "../types";
  import Input from "../components/Input.svelte";

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

<header class="p-4">
  <div class="flex gap-2 items-center mb-2">
    <Icon icon="fluent-color:bot-16" class="text-2xl" />
    <h1 class="text-2xl font-bold">Vivend'IA</h1>
  </div>

  <div class="flex items-center gap-2">
    <Input placeholder="Search discussions..." />
    <button class="flex items-center justify-center p-2 bg-background-secondary border border-border rounded-lg hover:bg-background">
    <Icon icon="mingcute:plus-fill" class="text-xl" />

    </button>
  </div>

</header>

<hr class="text-border" />

<main class="flex flex-col p-4 bg-background-secondary flex-1">
  <h2 class="uppercase mb-2 text-text-semi-light">Recent Discussions</h2>
  <section>
    <div class="grid gap-2">
      {#each discussions as discussion}
        <DiscussionPreview preview={discussion} />
      {/each}
    </div>
  </section>
</main>
