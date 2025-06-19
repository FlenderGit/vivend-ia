<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDivAttributes } from "$lib/types";
  
  type Props = HTMLDivAttributes & {
    children?: Snippet;
  };

  let { children }: Props = $props();
</script>

<header class="bg-primary px-4 py-2 shadow-md text-white font-bold">
  {#if children}
    {@render children()}
  {/if}
</header>
