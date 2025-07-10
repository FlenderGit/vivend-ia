<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { User } from "../types";
    import { authenticateUser } from "../utils/auth";
    import { wait } from "../utils";

    let state: "neutral" | "pending" | "success" | "error" = $state("neutral");

    type Props = {
        user?: User | null;
    };

    let { user = $bindable(null) }: Props = $props();


    function getIcon() {
        switch (state) {
            case "pending":
                return "mdi:loading";
            case "success":
                return "mdi:check-circle-outline";
            case "error":
                return "mdi:alert-circle-outline";
            default:
                return "mdi:lock-outline";
        }
    }

</script>

<header class="bg-primary text-white p-4 shadow-md mb-8">
    <h1 class="text-xl font-semibold">Vivend'ia</h1>
</header>

<main class="flex flex-col gap-4 items-center">
    <button
        class="bg-primary text-white px-4 py-2 rounded transition-colors hover:bg-primary-dark flex items-center font-semibold"
        onclick={async () => {
            state = "pending";
            const result = await authenticateUser();
            if (result.isOk()) {
                state = "success";
                chrome.storage.local.set({ user: result.value });
                await wait(1000);
                user = result.value;
            } else {
                console.error("Authentication failed:", result.error);
                state = "error";
            }
        }}
    >
        <div class:animate-spin={state === "pending"}>
            <Icon
                icon={getIcon()}
                class="size-4 mr-2"
            />
        </div>
        Login with Microsoft
    </button>
    <small>Please authenticate yourself to access your account.</small>
</main>

<p>{state}</p>
<pre>
    {#if user}
        <code>{JSON.stringify(user, null, 2)}</code>
    {:else}
        <code>No user authenticated</code>
    {/if}
</pre>
