<script lang="ts">
  import Icon from "@iconify/svelte";
  import ThemeForm from "../form/ThemeForm.svelte";
  import Modal from "../ui/Modal.svelte";

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  const TABS = ["general", "appearance", "privacy", "about"] as const;
  type Tabs = (typeof TABS)[number];

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
    <nav class="sm:border-r border-neutral-300">
      <ul class="flex sm:flex-col">
        {#each TABS as tab}
          <li>
            <button
              onclick={() => (tab_selected = tab)}
              class="p-2 hover:bg-neutral-200 rounded-lg w-full text-left"
            >
              {tab}
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
