<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = HTMLInputAttributes & {
    // onsubmit: (value: string) => void;
    // icon?: string;
  };

  const { ...rest }: Props = $props();
  let value = $state("");
</script>


<!-- <form class="p-2">
  <input
    type="text"
    placeholder="Type your message here..."
    class="w-full p-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    bind:value
  />
  <button
    type="submit"
    class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Send message"
    onclick={(event) => {
      event.preventDefault();
      if (value.trim()) {
        onsubmit(value);
        value = "";
      }
    }}
  >
    Send
  </button>
</form> -->
