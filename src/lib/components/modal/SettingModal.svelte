<script lang="ts">
  import Icon from "@iconify/svelte";
  import ThemeForm from "../form/ThemeForm.svelte";
  import Modal from "../ui/Modal.svelte";
  import Input from "../Input.svelte";

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  const TABS = [{
    id: "general",
    label: "General",
    icon: "mdi:settings"
  }, {
    id: "appearance",
    label: "Appearance",
    icon: "mdi:palette"
  }, {
    id: "privacy",
    label: "Privacy",
    icon: "mdi:lock"
  }, {
    id: "about",
    label: "About",
    icon: "mdi:information"
  }]

  type Tabs = typeof TABS[number]["id"];

  const ABOUT_DATA = {
    lastUpdate: "2023-10-01",
  };

  let font_size = $state(16);

  let tab_selected: Tabs = $state("general");
</script>

<Modal bind:open class="">
  {#snippet header()}
    <h2 class="text-lg font-semibold">Settings ({tab_selected})</h2>
  {/snippet}

  <div class="flex flex-col sm:flex-row">
    <nav class="sm:border-r border-background-tertiary pr-4">
      <ul class="flex sm:flex-col">
        {#each TABS as tab}
          <li>
            <button
              onclick={() => (tab_selected = tab.id)}
              class:bg-primary={tab_selected === tab.id}
              class={[
                "flex items-center gap-2 rounded-lg w-full text-left p-2 transition-all",
                tab_selected === tab.id ? "text-white bg-primary" : "hover:bg-neutral-500/15"
              ]}
            >
              <Icon icon={tab.icon} class="size-4 mr-2" />
              {tab.label}
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="flex-1 p-6 flex flex-col gap-2">
      {#if tab_selected === "general"}
        <p>General settings</p>
      {:else if tab_selected === "appearance"}
        <ThemeForm />
        <label>
          Taille texte:
          <input type="range" min="12" max="24" bind:value={font_size} />
          <span>{font_size}</span>
        </label>
      {:else if tab_selected === "privacy"}
        <p>Privacy settings</p>
        <hr class="text-neutral-300" />
        <button>
            Supprimer toutes les données
        </button>
        <i>Cette action est irréversible et supprimera toutes vos données.</i>
      {:else if tab_selected === "about"}
        <div class="mx-auto flex flex-col items-center gap-1">
          <Icon icon="mingcute:information-line" class="size-12" />
          <p class="font-semibold text-lg">Vivend'ia</p>
          <p class="text-sm opacity-60">
            Version {__VERSION__}
            {#if import.meta.env.DEV}
              <span>(DEV)</span>
            {/if}
          </p>
        </div>

        <hr class="text-neutral-300" />
        <div class="flex flex-col p-2 gap-2">
          <a href="#">Conditions d'utilisations</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Signaler un bug</a>
        </div>
      {:else}
        <p>Unknown settings tab</p>
      {/if}
    </div>
  </div>
</Modal>
