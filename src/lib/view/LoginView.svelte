<script lang="ts">
  import Icon from "@iconify/svelte";
  import { authenticator } from "../utils/auth";
  import { user_store } from "$lib/stores/user";
    import { t } from "$lib/utils/i18n";

  let status: "neutral" | "pending" | "success" | "error" = $state("neutral");

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

<!-- In web mode, the UI have already a header -->
{#if import.meta.env.MODE === "extension"}
  <header class="bg-primary text-white p-4 shadow-md">
    <h1 class="text-xl font-semibold">{__APP_NAME__}</h1>
  </header>
{/if}

<main class="flex flex-col gap-4 items-center mt-8">
  <button
    class="bg-primary text-white px-4 py-2 rounded transition-colors hover:bg-primary-dark flex items-center font-semibold gap-2"
    class:cursor-not-allowed={status === "pending"}
    class:opacity-75={status === "pending"}
    onclick={async () => {
      status = "pending";
      authenticator.authenticate(true)
        .match(
          (data) => {
            status = "success";
            $user_store = data;
          },
          (err) => {
            status = "error";
            console.error(err.message);
            error = err.message;
          }
        );
    }}
  >
    <div class:animate-spin={status === "pending"}>
      <Icon icon={getIcon()} class="size-4" />
    </div>
    {t("helping_connect_with_microsoft")}
  </button>
  <small>
    {t("helping_connect_to_access")}
  </small>

  <small class="text-danger text-center" hidden={!error}>
    {error}
  </small>
</main>
