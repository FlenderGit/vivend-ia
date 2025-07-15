<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { User } from "../types";
  import { authenticateUser, getUserData } from "../utils/auth";
  import { ResultAsync } from "neverthrow";
  import { auth_store } from "$lib/stores/auth";

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
      authenticateUser()
        .map(response => {
          $auth_store = response;
          return response;
        })
        .andThen((response) => {
          return ResultAsync.fromPromise(
            chrome.storage.local.set({ auth: response }),
            (error) => new Error(`Failed to store auth: ${error}`)
          ).map(() => response);
        })
        .andThen((response) => getUserData(response.accessToken))
        .match(
          (data) => {
            status = "success";
            user = data;
          },
          (err) => {
            status = "error";
            error = err.message;
          }
        );
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
