<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = {
    icon: string;
    onclick?: () => Promise<boolean | void>;
  } & HTMLButtonAttributes;

  const { icon, onclick, title, ...rest }: Props = $props();

  const handleClick = async (_: MouseEvent) => {
    if (onclick) {
      state = "pending";
      const result = await onclick();
      console.log("ClickableIcon clicked", result);
      if (result !== undefined) {
        state = result ? "success" : "error";
        setTimeout(() => {
          state = "neutral";
        }, 2000);
      } else {
        state = "neutral";
      }
    }
  };

  let state: "neutral" | "pending" | "success" | "error" = $state("neutral");
</script>

<button
  onclick={handleClick}
  class="flex-center cursor-pointer size-8 rounded-lg hover:bg-neutral-300 transition-colors"
  {...rest}
  {title}
  aria-label={title}
>
  {#if state === "success"}
    <Icon icon="line-md:check-all" class="text-green-500" />
  {:else if state === "error" }
    <Icon icon="line-md:cross" class="text-red-500" />
  {:else if state === "pending"}
    <Icon icon="line-md:loading-loop" class="animate-spin text-blue-500" />
  {:else}
    <Icon {icon} />
  {/if}
</button>
