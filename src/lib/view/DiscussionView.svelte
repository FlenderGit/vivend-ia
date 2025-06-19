<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Discussion } from "../classes";
  import Topbar from "../components/ui/Topbar.svelte";
  import MessageAreaView from "../components/discussion/MessageAreaView.svelte";
  import Input from "../components/Input.svelte";


    type Props = {
        discussion: Discussion;
    }

    let { discussion }: Props = $props();
    let value = $state("");

</script>

<main class="h-screen grid grid-rows-[auto_1fr_auto]">
  <Topbar>
    <Icon icon="lucide:arrow-down"></Icon>
    <Icon icon={discussion.icon} class="text-2xl" />
    <h1 class="text-lg">MyChat</h1>
  </Topbar>
  <MessageAreaView {discussion} />
  <Input onsubmit={value => {
    discussion.addMessage(value, "user");
    discussion.addMessage("This is a placeholder response.", "assistant");
  }} />
</main>
