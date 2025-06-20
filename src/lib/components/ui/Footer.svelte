<script lang="ts">
  import Icon from "@iconify/svelte";

  type Link = {
    name: string;
    destination: string;
    icon: string;
  };
  const links: Array<Link> = [
    {
      name: "Home",
      destination: "/",
      icon: "mingcute:home-3-line",
    },
    {
      name: "About",
      destination: "/about",
      icon: "mingcute:information-line",
    },
    {
      name: "Contact",
      destination: "/contact",
      icon: "mingcute:contacts-2-line",
    },
    {
      name: "Policy",
      destination: "/privacy-policy",
      icon: "mingcute:safe-shield-2-fill",
    },
  ];

  const selected = "Home"; 
</script>

<footer class="p-1">
  <nav>
    <ul class="flex gap-4 justify-around items-center">
      {#each links as link}
        <li>
          <a href={link.destination} aria-label={link.name} class="flex flex-col items-center text-text-light rounded px-4 py-2"
            class:text-primary={link.name === selected}
            class:bg-background-secondary={link.name === selected}
            class:text-text-light={link.name !== selected}
          >
            <Icon icon={link.icon} class="size-8" />
            <span class="text-xs uppercase">{link.name}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</footer>
