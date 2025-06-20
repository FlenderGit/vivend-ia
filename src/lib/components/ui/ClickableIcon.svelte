<script lang="ts">
  import Icon from "@iconify/svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = {
    icon: string;
    onclick?: () => void;
  } & HTMLButtonAttributes;

  const { icon, onclick, title, ...rest }: Props = $props();

</script>

<button
  {onclick}
  class="flex-center cursor-pointer size-8 rounded-lg hover:bg-neutral-300 transition-colors"
  {...rest}
  {title}
  aria-label={title}
>
  <Icon {icon} />
</button>
