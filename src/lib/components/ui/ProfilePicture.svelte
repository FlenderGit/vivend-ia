<script lang="ts">
    import type { User } from "../../types";

    type Props = {
        user: User;
    };

    const { user }: Props = $props();

    const BASE_CSS = "size-10";
</script>

{#if user.profilePicture}
    <p>NoHandled</p>
{:else}
    <div
        class="{BASE_CSS} flex items-center justify-center bg-primary text-white rounded-full"
    >
        <span class="font-semibold text-lg">{user.name.charAt(0)}</span>
    </div>
{/if}
