<script lang="ts">
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
    <nav class="sm:border-r">
      <ul class="flex sm:flex-col">
        {#each TABS as tab}
          <li>
            <button onclick={() => (tab_selected = tab)}>
              {tab}
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <div>
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
      {:else if tab_selected === "about"}
        <p>
          Version: {__VERSION__}
          {#if import.meta.env.DEV}
            <span>(DEV)</span>
          {/if}
        </p>

        <hr />
        <p>Conditions d'utilisations</p>
        <p>Politique de confidentialité</p>
        <p>Signaler un bug</p>
      {:else}
        <p>Unknown settings tab</p>
      {/if}
    </div>
  </div>
</Modal>
