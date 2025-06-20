<script lang="ts">
  import { onMount } from "svelte";
  import type { ToastData } from "../../types";

  type Props = {
    toast: ToastData;
    onclose: () => void;
  };

  onMount(() => {
    if (toast.duration) {
      setTimeout(() => {
        onclose();
      }, toast.duration);
      setInterval(() => {
        value = Math.max(0, value - 100);
      }, 100);
    }
  });

  const { toast, onclose }: Props = $props();
  let value = $state(toast.duration);
  const percent = $derived(value / toast.duration * 100);
</script>

<div
  aria-atomic="true"
  aria-live="polite"
  class="bg-neutral-300 rounded-lg p-4"
>
  <p>{toast.message}</p>
  {#if toast.duration}
    <div
      class="w-full mt-2 h-1 bg-neutral-400 rounded-lg"
    >
      <div
        class="h-full bg-neutral-500 rounded-lg"
        style="width: {percent}%; transition: width 100ms linear;"
      ></div>
    </div>
  {/if}
</div>
