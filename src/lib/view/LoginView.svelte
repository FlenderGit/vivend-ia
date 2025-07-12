<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { User } from "../types";
  import { authenticateUser } from "../utils/auth";
  import { wait } from "../utils";

  let status: "neutral" | "pending" | "success" | "error" = $state("neutral");

  type Props = {
    user?: User | null;
  };

  let { user = $bindable(null) }: Props = $props();

  let error: string | null = $state(null);

  function getIcon() {
    switch (status) {
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
    class="bg-primary text-white px-4 py-2 rounded transition-colors hover:bg-primary-dark flex items-center font-semibold gap-2"
    class:cursor-not-allowed={status === "pending"}
    class:opacity-75={status === "pending"}
    onclick={async () => {
      status = "pending";
      const result = await authenticateUser();
      if (result.isOk()) {
        status = "success";
        chrome.storage.local.set({ user: result.value });
        await wait(1000);
        user = result.value;
      } else {
        console.error("Authentication failed:", result.error);
        status = "error";
        error = result.error.message;
      }
    }}
  >
    <div class:animate-spin={status === "pending"}>
      <Icon icon={getIcon()} class="size-4" />
    </div>
    Login with Microsoft
  </button>
  <small>Please authenticate yourself to access your account.</small>

  <small class="text-danger text-center" hidden={!error}>
    {error}
  </small>
</main>
