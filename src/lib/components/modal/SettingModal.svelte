<script lang="ts">
  import Icon from "@iconify/svelte";
  import ThemeForm from "../form/ThemeForm.svelte";
  import Modal from "../ui/Modal.svelte";

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

  let font_size = $state(16);
  let tab_selected: Tabs = $state("general");
</script>

<Modal bind:open>
  {#snippet header()}
    <h2 class="text-lg font-semibold">Settings</h2>
  {/snippet}

  <div class="flex flex-col sm:flex-row h-80">
    <nav class="sm:border-r border-background-tertiary pr-4">
      <ul class="flex sm:flex-col gap-1 overflow-x-auto">
        {#each TABS as tab}
          <li>
            <button
              onclick={() => (tab_selected = tab.id)}
              class:bg-primary={tab_selected === tab.id}
              class={[
                "flex items-center gap-2 rounded-lg w-full text-left px-2 py-1 transition-all",
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

    <div class="flex-1 p-6 flex flex-col gap-4">
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
        <div class="flex-1">
          <p>Privacy settings</p>
        </div>
        <hr class="text-neutral-300" />
        <button class="button bg-danger text-white justify-center hover:opacity-90">
            Supprimer toutes les données
        </button>
        <i class="text-center">Cette action est irréversible et supprimera toutes vos données.</i>
      {:else if tab_selected === "about"}
        <div class="mx-auto flex flex-col flex-1 flex-center gap-1">
          <Icon icon="mingcute:information-line" class="size-12" />
          <p class="font-semibold text-lg">Vivend'ia</p>
          <p class="text-sm opacity-60">
            Version {__VERSION__}
            {#if import.meta.env.DEV}
              <span>(DEV - {import.meta.env.MODE})</span>
            {/if}
          </p>
        </div>

        <hr class="text-neutral-300" />
        <div class="flex flex-col gap-2">
          <a href="https://example.com/terms-of-service">Conditions d'utilisations</a>
          <a href="https://example.com/privacy-policy">Politique de confidentialité</a>
          <a href="https://example.com/report-bug">Signaler un bug</a>
        </div>
      {:else}
        <p>Unknown settings tab</p>
      {/if}
    </div>
  </div>
</Modal>
