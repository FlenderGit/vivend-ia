<script lang="ts">
  import type { Size } from "$lib/types/components";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    size?: Size;
    ref?: HTMLInputElement | null;
  } & Omit<HTMLInputAttributes, "size">;

  let { value = $bindable(""), class: classData, size = "medium", ref = $bindable(null), ...rest }: Props = $props();

  function getSizeClass(size: Size): string {
    switch (size) {
      case "small":
        return "text-sm px-2 py-1 rounded-md";
      case "medium":
        return "text-base px-4 py-2 rounded-xl";
      case "large":
        return "text-lg px-5 py-3 rounded-2xl";
    }
  }

</script>

<input {...rest} class="input {classData} {getSizeClass(size)}" bind:value bind:this={ref} />
