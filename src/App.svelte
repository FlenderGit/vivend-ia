<script lang="ts">
  import Toast from "./lib/components/ui/Toast.svelte";
  import LoginView from "./lib/view/LoginView.svelte";
  import ConversationView from "./lib/view/ConversationView.svelte";
  import { onMount } from "svelte";
  import { toasts_store } from "./lib/stores/toasts";
  import { user_store } from "$lib/stores/user";
  import { current_tab_store } from "$lib/stores/current_tab";
  import Icon from "@iconify/svelte";
    import { authenticator } from "$lib/utils/auth";
    import { blur } from "svelte/transition";
    import { theme_store } from "$lib/stores/theme";
    import { ExtensionStorage } from "$lib/utils/storage";
    import type { Theme } from "$lib/constants/themes";

    let loading = $state(true);
  onMount(() => {
    authenticator.authenticate(false).andTee((user) => {
      user_store.set(user);
      console.log("User loaded on startup:", user);
    }).match(
      (user) => {
        console.log("Authentication successful on startup:", user);
      },
      (err) => {
        console.error("Authentication failed on startup:", err);
      }
    ).finally(() => {
      loading = false;
    });

    const theme_storage = new ExtensionStorage<Theme>();
    theme_storage.get("theme").then(theme => {
      console.log("Loaded theme from storage:", theme);
      theme_store.set(theme);
    }).catch(err => {
      console.error("Failed to load theme from storage:", err);
    });

    $effect(() => {
      if ($theme_store?.font) {
        console.log("Applying theme font:", $theme_store.font);
        document.documentElement.style.setProperty("--default-font-family", $theme_store.font);
      }
    })

    // theme_storage.set("theme", {
    //   font: "Arial, sans-serif",
    //   colors: {
    //     primary: "hsl(220, 90%, 56%)",
    //     background: "hsl(0, 0%, 100%)"
    //   }
    // }).catch(err => {
    //   console.error("Failed to save theme to storage:", err);
    // });

    // document.documentElement.style.setProperty(
    //   "--color-primary",
    //   "hsl(220, 90%, 56%)"
    // );
  });

</script>

<svelte:window on:visibilitychange={() => console.log("Visibility changed:", document.visibilityState)} />

<svelte:head>
  <title>{ __APP_NAME__ }</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href={`https://fonts.googleapis.com/css2?family=${($theme_store?.font ?? "Arial").replace(/ /g, "+")}&display=swap`} rel="stylesheet">
</svelte:head>

{#if loading}
  <div class="flex flex-center flex-1">
    <Icon
      icon="line-md:loading-loop"
      class="animate-spin text-4xl opacity-75"
    />
  </div>

{:else if !import.meta.env.VITE_LIST_ALLOWED_ORIGINS.split(",").includes($current_tab_store?.origin)}
 <div class="flex flex-center flex-1 flex-col text-center px-4" in:blur>
  <Icon icon="mingcute:alert-line" class="text-6xl" />
  <p>Cette page n'est pas autorisée à utiliser l'extension.</p>
  <p>Veuillez contacter l'administrateur si vous pensez que c'est une erreur.</p>
  {#if import.meta.env.VITE_ADMIN_EMAIL}
    <a href="mailto:{import.meta.env.VITE_ADMIN_EMAIL}">Contacter l'administrateur</a>
  {/if}
 </div>
{:else if $user_store === null}
  <LoginView />
{:else}
  <div in:blur>
    <ConversationView />
  </div>
{/if}

<div class="absolute right-4 top-4 z-50">
  {#each $toasts_store as toast}
    <Toast
      {toast}
      onclose={() => {
        toasts_store.removeToast(toast.id);
      }}
    />
  {/each}

</div>
