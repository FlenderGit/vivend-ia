<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDialogAttributes } from "svelte/elements";

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
    console.log("Modal clicked", event);
    if (event.target === modal) {
      open = false;
    }
  }}
  bind:this={modal}
  class="z-50 backdrop:bg-neutral-800/30 rounded-lg p-4 shadow-lg outline-0 m-auto container"
  style="width: min(calc(100vw - 2rem), 48rem);"
>
  {#if header}
    <header>
      {@render header()}
    </header>
  {/if}
  {@render children()}
</dialog>
