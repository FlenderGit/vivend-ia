<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    open?: boolean;
    header?: Snippet;
    children: Snippet;
  };

  let { open = $bindable(false), header, children }: Props = $props();

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
  class="z-50 backdrop:bg-neutral-800/30 m-auto rounded-lg p-4 shadow-lg w-full max-w-md outline-0"
>
  {#if header}
    <header>
      {@render header()}
    </header>
  {/if}
  {@render children()}
</dialog>
