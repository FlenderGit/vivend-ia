<script lang="ts">
  import { slide } from "svelte/transition";
  import ClickableIcon from "../components/ui/ClickableIcon.svelte";
  import Modal from "../components/ui/Modal.svelte";
  import Sidebar from "../components/ui/Sidebar.svelte";
  import MessageAreaView from "../components/conversation/MessageAreaView.svelte";
  import { current_conversation_store } from "../stores/current_conversation";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import Input from "$lib/components/Input.svelte";
  import { t } from "$lib/utils/i18n";

  const { conversation, isLoading, error } = current_conversation_store;

  let open = $state(false);

  async function onsubmit(event: Event) {
    event.preventDefault();
    if (input_ref === null) return;
    if (!$conversation) {
      console.error("No conversation available");
      return;
    }
    const message = input_ref.value.trim();

    if (message) {
      await $conversation.sendMessageToAi(message);
      input_ref.value = "";
      input_ref.focus();
    }
  }

  let input_ref: HTMLInputElement | null = $state(null);

  function handleKeyDown(event: KeyboardEvent) {
    const isCtrlPress = event.ctrlKey || event.metaKey;
    const isFocusOnInput = document.activeElement === input_ref;
    if (event.key === "Enter" && !isFocusOnInput && isCtrlPress) {
      event.preventDefault();
      input_ref?.focus();
    }
    if (isCtrlPress && event.key === "E") {
      event.preventDefault();
      open = !open;
    }
  }

  onMount(() => {
    current_conversation_store.loadDefaultConversation();

    // Get the page name
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Titre:", tabs[0].title);
        console.log("URL:", tabs[0].url);
      }
    });
  });

  let modalOpen = $state(false);
  let window_width = $state(window.innerWidth);
  let derived_open = $derived(open || window_width >= 768);
</script>

<svelte:window onkeydown={handleKeyDown} bind:innerWidth={window_width}/>

<Modal bind:open={modalOpen}>
  {#snippet header()}
    <h2>{t("action_create_new_chat")}</h2>
  {/snippet}
  <form>
    <p>Title & Icon & Feeling</p>
  </form>
</Modal>
<h1 class="sr-only">{__APP_NAME__}</h1>
<a href="#main-content" class="sr-only">{t("helping_skip_link")}</a>

<header class="flex gap-2 p-2 z-50 fixed md:hidden">
  <ClickableIcon
    title="Ouvrir la barre de navigation"
    icon="mingcute:align-left-line"
    onclick={() => (open = !open)}
  />
  <ClickableIcon
    title={t("ui_new_chat")}
    icon="mingcute:edit-line"
    disabled={$conversation?.id === ""}
    onclick={() => {
      current_conversation_store.loadDefaultConversation();
    }}
  />
</header>

<!-- <ThemeForm /> -->

<div class="flex h-screen bg-background-secondary">
  <Sidebar
    aria-label="Liste des précédentes conversations"
    aria-keyshortcuts="Ctrl+E"
    bind:open={derived_open}
    onclose={() => (open = false)}
  />
  {#if derived_open}
    <div transition:slide={{ axis: "x", duration: 400 }} class="md:w-64"></div>
  {/if}

  <div
    class="flex-1 grid transition-all duration-500 {derived_open && 'md:py-3 md:pr-3'}"
  >
    <div class="grid flex-1 overflow-y-auto bg-background z-30 lshadow {derived_open && 'md:rounded-xl'}">
    <main
      id="main-content"
      class="mx-auto flex flex-col gap-2 flex-1 p-4 duration-500 transition-all w-full max-w-2xl"
    >

    <!-- <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio vero atque eos in ab ex omnis quas cupiditate reiciendis? Voluptatum debitis provident consequatur obcaecati reprehenderit possimus sed! Quam, vero delectus? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque saepe quis nulla quisquam quod! Impedit non velit alias ipsum dolore perspiciatis sapiente aspernatur voluptate provident omnis harum, et quibusdam esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in saepe aperiam dolore pariatur accusantium et, explicabo accusamus! Animi officiis rem reprehenderit ex atque dolor facere voluptate quis, aspernatur dolorem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis neque aut blanditiis commodi at sed dolorem facere, odio aliquid tempore id suscipit accusamus laborum itaque quaerat, ipsam ad perferendis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta sapiente amet unde ipsam accusamus pariatur et molestias rem quo quas! Tenetur perferendis harum quibusdam eum? Aliquam aliquid eligendi ducimus rem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ab praesentium odit, possimus minus autem eum corporis nesciunt ea et sapiente, laborum asperiores sit. Nihil aut commodi saepe voluptate voluptatibus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio vero atque eos in ab ex omnis quas cupiditate reiciendis? Voluptatum debitis provident consequatur obcaecati reprehenderit possimus sed! Quam, vero delectus? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque saepe quis nulla quisquam quod! Impedit non velit alias ipsum dolore perspiciatis sapiente aspernatur voluptate provident omnis harum, et quibusdam esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in saepe aperiam dolore pariatur accusantium et, explicabo accusamus! Animi officiis rem reprehenderit ex atque dolor facere voluptate quis, aspernatur dolorem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis neque aut blanditiis commodi at sed dolorem facere, odio aliquid tempore id suscipit accusamus laborum itaque quaerat, ipsam ad perferendis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta sapiente amet unde ipsam accusamus pariatur et molestias rem quo quas! Tenetur perferendis harum quibusdam eum? Aliquam aliquid eligendi ducimus rem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ab praesentium odit, possimus minus autem eum corporis nesciunt ea et sapiente, laborum asperiores sit. Nihil aut commodi saepe voluptate voluptatibus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio vero atque eos in ab ex omnis quas cupiditate reiciendis? Voluptatum debitis provident consequatur obcaecati reprehenderit possimus sed! Quam, vero delectus? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque saepe quis nulla quisquam quod! Impedit non velit alias ipsum dolore perspiciatis sapiente aspernatur voluptate provident omnis harum, et quibusdam esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in saepe aperiam dolore pariatur accusantium et, explicabo accusamus! Animi officiis rem reprehenderit ex atque dolor facere voluptate quis, aspernatur dolorem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis neque aut blanditiis commodi at sed dolorem facere, odio aliquid tempore id suscipit accusamus laborum itaque quaerat, ipsam ad perferendis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta sapiente amet unde ipsam accusamus pariatur et molestias rem quo quas! Tenetur perferendis harum quibusdam eum? Aliquam aliquid eligendi ducimus rem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ab praesentium odit, possimus minus autem eum corporis nesciunt ea et sapiente, laborum asperiores sit. Nihil aut commodi saepe voluptate voluptatibus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio vero atque eos in ab ex omnis quas cupiditate reiciendis? Voluptatum debitis provident consequatur obcaecati reprehenderit possimus sed! Quam, vero delectus? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque saepe quis nulla quisquam quod! Impedit non velit alias ipsum dolore perspiciatis sapiente aspernatur voluptate provident omnis harum, et quibusdam esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in saepe aperiam dolore pariatur accusantium et, explicabo accusamus! Animi officiis rem reprehenderit ex atque dolor facere voluptate quis, aspernatur dolorem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis neque aut blanditiis commodi at sed dolorem facere, odio aliquid tempore id suscipit accusamus laborum itaque quaerat, ipsam ad perferendis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta sapiente amet unde ipsam accusamus pariatur et molestias rem quo quas! Tenetur perferendis harum quibusdam eum? Aliquam aliquid eligendi ducimus rem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ab praesentium odit, possimus minus autem eum corporis nesciunt ea et sapiente, laborum asperiores sit. Nihil aut commodi saepe voluptate voluptatibus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio vero atque eos in ab ex omnis quas cupiditate reiciendis? Voluptatum debitis provident consequatur obcaecati reprehenderit possimus sed! Quam, vero delectus? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque saepe quis nulla quisquam quod! Impedit non velit alias ipsum dolore perspiciatis sapiente aspernatur voluptate provident omnis harum, et quibusdam esse! Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in saepe aperiam dolore pariatur accusantium et, explicabo accusamus! Animi officiis rem reprehenderit ex atque dolor facere voluptate quis, aspernatur dolorem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique reiciendis neque aut blanditiis commodi at sed dolorem facere, odio aliquid tempore id suscipit accusamus laborum itaque quaerat, ipsam ad perferendis! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta sapiente amet unde ipsam accusamus pariatur et molestias rem quo quas! Tenetur perferendis harum quibusdam eum? Aliquam aliquid eligendi ducimus rem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ab praesentium odit, possimus minus autem eum corporis nesciunt ea et sapiente, laborum asperiores sit. Nihil aut commodi saepe voluptate voluptatibus.
    </p> -->
      {#if $isLoading}
        <Icon
          icon="line-md:loading-loop"
          class="animate-spin m-auto text-4xl opacity-75"
        />
      {:else if $error}
        <p class="text-danger opacity-75 m-auto">Erreur: {$error.message}</p>
      {:else if $conversation}
        {#if input_ref}
          <MessageAreaView
            bind:input_ref
            discussion={$conversation}
            class="flex-1"
          />
        {/if}
        <section>
          <form {onsubmit}>
            <Input
              aria-keyshortcuts="Ctrl+Enter"
              disabled={$conversation.status === "pending" || $conversation.status === "writing"}
              type="text"
              placeholder={t("ui_send")}
              class="input lshadow"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              bind:ref={input_ref}
              aria-label="Type your message"
              aria-describedby="input-hint"
            />
            <small class="text-xs sr-only" id="input-hint">
              {t("helping_enter_send_message")}
            </small>
          </form>
        </section>
      {:else}
        <p class="text-text-light">{t("error_no_chat_selected")}</p>
      {/if}
    </main>

    </div>
  </div>
  <!-- <ConversationView class="flex-1" {discussion} {open} /> -->
</div>
