<script lang="ts">
  import { onMount } from "svelte";
  import type { ToastData } from "../../types";
  import Icon from "@iconify/svelte";

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
  const percent = $derived((value / toast.duration) * 100);

  function getIcon(toast: ToastData) {
    switch (toast.type) {
      case "success":
        return "line-md:check-all";
      case "error":
        return "line-md:cross";
      case "info":
        return "mingcute:information-line";
      default:
        return "line-md:notification";
    }
  }

  function getClassColor(toast: ToastData) {
    switch (toast.type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return " text-blue-800 border-blue-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  }
</script>

<div
  aria-atomic="true"
  aria-live="polite"
  class="bg-neutral-100 lshadow rounded-lg p-4 border-l-4 {getClassColor(toast)} "
>
  <div class="flex-1 flex items-center gap-4">
      <Icon
        icon={getIcon(toast)}
        class="text-xl"
        style="width: 1.5em; height: 1.5em;"
      />

    <div>
      <p>{toast.message}</p>
      <p>{toast.description}</p>
    </div>
  </div>

  {#if toast.duration}
    <div class="w-full mt-2 h-1 bg-neutral-400 rounded-lg">
      <div
        class="h-full bg-neutral-500 rounded-lg"
        style="width: {percent}%; transition: width 100ms linear;"
      ></div>
    </div>
  {/if}
</div>
