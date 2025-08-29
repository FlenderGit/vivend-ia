<script lang="ts">
    import Icon from "@iconify/svelte";
  import type { Snippet } from "svelte";
  import type { HTMLDialogAttributes } from "svelte/elements";
    import ClickableIcon from "./ClickableIcon.svelte";

  type Props = {
    open?: boolean;
    header?: Snippet;
    children: Snippet;
  } & HTMLDialogAttributes;

  let { open = $bindable(false), header, children, ...rest }: Props = $props();

  let modal: HTMLDialogElement;

  $effect(() => {
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  });
</script>

<dialog
  {...rest}
  onclose={() => {
    open = false;
  }}
  onclick={(event) => {
    if (event.target === modal) {
      open = false;
    }
  }}
  bind:this={modal}
  class="z-50 backdrop:bg-neutral-800/30 rounded-lg p-4 shadow-lg outline-0 m-auto container"
  style="width: min(calc(100vw - 2rem), 48rem);"
>
<div>
  {#if header}
    <header class="flex gap-2 items-center justify-between">
      {@render header()}
      <ClickableIcon icon="mingcute:close-line" onclick={() => (open = false)} />
    </header>
  {/if}
  <main class="overflow-auto mt-4 flex-1">
    {@render children()}
  </main>
</div>
</dialog>
