<script lang="ts">
  import Modal from "../ui/Modal.svelte";

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();
</script>

<Modal bind:open>
    {#snippet header()}
        <h2 class="text-lg font-semibold">Search</h2>
    {/snippet}
    
    <div class="p-4">
        <input
        type="text"
        placeholder="Search..."
        class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
    
    <div class="p-4">
        <!-- Search results will be displayed here -->
        <p class="text-sm text-neutral-700">No results found.</p>
    </div>

</Modal>
