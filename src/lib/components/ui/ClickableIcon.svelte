<script lang="ts">
  import createPopperAction from "$lib/actions/popper";
  import Icon from "@iconify/svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type OnClickFn =
    | {
        onclickpromise: () => Promise<boolean | void>;
        onclick?: never;
      }
    | {
        onclick?: (e: MouseEvent) => void;
        onclickpromise?: never;
      };

  type Props = {
    icon: string;
    popper?: boolean;
  } & OnClickFn &
    HTMLButtonAttributes;

  const {
    icon,
    onclick,
    onclickpromise,
    title,
    popper = false,
    ...rest
  }: Props = $props();

  let [usePopperElement, usePopperTooltip] = createPopperAction();

  const handleClick = async (e: MouseEvent) => {
    if (onclickpromise) {
      status = "pending";
      const result = await onclickpromise();
      console.log("ClickableIcon clicked", result);
      if (result !== undefined) {
        status = result ? "success" : "error";
        setTimeout(() => {
          status = "neutral";
        }, 2000);
      } else {
        status = "neutral";
      }
    } else if (onclick) {
      onclick(e);
    }
  };

  let isHover = $state(false);

  let status: "neutral" | "pending" | "success" | "error" = $state("neutral");
</script>

{#snippet IconStatus()}
  {#if status === "success"}
    <Icon icon="line-md:check-all" class="text-green-500" />
  {:else if status === "error"}
    <Icon icon="line-md:cross" class="text-red-500" />
  {:else if status === "pending"}
    <Icon icon="line-md:loading-loop" class="animate-spin text-blue-500" />
  {:else}
    <Icon {icon} />
  {/if}
{/snippet}

{#if popper}
  <button
    onclick={handleClick}
    class="flex-center cursor-pointer size-8 rounded-lg hover:backdrop-brightness-90 transition-colors"
    {...rest}
    aria-label={title}
    use:usePopperElement
    onmouseenter={() => (isHover = true)}
    onmouseleave={() => (isHover = false)}
  >
    {@render IconStatus()}
  </button>
{:else}
  <button
    onclick={handleClick}
    class="flex-center cursor-pointer size-8 rounded-lg hover:backdrop-brightness-90 transition-colors"
    {...rest}
    aria-label={title}
    {title}
  >
    {@render IconStatus()}
  </button>
{/if}

{#if popper && isHover}
  <div
    use:usePopperTooltip={{
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    }}
    class="bg-neutral-800 text-white px-2 py-1 rounded-md shadow-lg text-xs"
  >
    {title}
  </div>
{/if}
