<script lang="ts">
  import { tick } from "svelte";
  import type { Conversation } from "../../classes";
  import type { HTMLSectionAttributes } from "../../types";
  import { marked } from "marked";
  import { current_tab_store } from "$lib/stores/current_tab";
  import { fetch_suggestions } from "$lib/api/suggestion";
  import { blur } from "svelte/transition";
  import EmptyConversation from "./EmptyConversation.svelte";
  import type { AssistantMessage, MessageByRole, ResponseItem, ResponseItemReasoning } from "$lib/types/openai";
  import { is_user_message } from "$lib/utils/openai";
  import UserMessageView from "./message/UserMessageView.svelte";
  import AssistantMessageView from "./message/AssistantMessageView.svelte";
  import type { ResponseOutputMessage } from "openai/resources/responses/responses.js";

  type Props = {
    input_ref: HTMLInputElement;
    discussion: Conversation;
  } & HTMLSectionAttributes;

  let { input_ref = $bindable(), discussion, class: classData, ...rest }: Props = $props();

  let viewport: HTMLSectionAttributes;

  $effect(() => {
    discussion.id;
    // Scroll to bottom when the discussion is loaded
    viewport.scrollTo({
      top: viewport.scrollHeight,
    });
  });

  $effect.pre(() => {
    discussion.messageCount;
    discussion.bufferMessage.length;

    if (!viewport || length) return;
    const needAutoscroll =
      viewport &&
      viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 150;

    if (needAutoscroll) {
      tick().then(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  });

    function splitMessageByRole(messages: ResponseItem[]): MessageByRole[] {

      let result: MessageByRole[] = [];
      let reasoningBuffer: ResponseItemReasoning[] = [];
      let assistantMessageBuffer: AssistantMessage[] = [];
      let functionCallBuffer: Record<string, string> = {};

      const flushReasoningBuffer = (): void => {
        if (assistantMessageBuffer.length) {
          result.push({ 
            role: "assistant", 
            message: [...assistantMessageBuffer],
            reasoning: [...reasoningBuffer],
          });
          reasoningBuffer = [];
        }
      };

      const is_showable_assistant_message = (message: ResponseItem): message is ResponseOutputMessage => {
        return message.type === "message" && message.role === "assistant";
      };

      for (const message of messages) {
        // If the message is from user, push the buffer as assistant and clear it
        if (is_user_message(message)) {
          flushReasoningBuffer(); 
          result.push({ role: "user", message});
        } else {
          
          // Save the function name using id
          if (message.type === "function_call") {
            if (message.id) {
              functionCallBuffer[message.call_id] = message.name
            } else {
              console.warn("Function call message without id:", message);
            }

          }

          // console.log(message, functionCallBuffer, message.type === "function_call_output" && functionCallBuffer[message.id] : null);
          if (is_showable_assistant_message(message)) {
            assistantMessageBuffer.push(message);
          } else if (message.type === "function_call_output" && message.id != undefined && functionCallBuffer[message.call_id] === "create_graph") {
            assistantMessageBuffer.push({
              ...message,
              name: "create_graph"
            });
          } else {
            reasoningBuffer.push(message);
          }

        // If it's a message from assistant, push the buffer
        // } else if (is_assistant_message(message)) {
        //   flushReasoningBuffer(message);
        // // Else (it reasoning, function_call, etc.), add to buffer
        // } else {
        //   reasoningBuffer.push(message);
        // }
      }
    }
      
      flushReasoningBuffer();
      console.log("Messages split by role:", result);
      return result;
    }

    const messages_splited = $derived(splitMessageByRole(discussion.messages.data));
    // const suggestions = $derived(await fetch_suggestions($current_tab_store));
    
    let suggestions: string[] = $state([]);
    $effect(async () => {
      const result = await fetch_suggestions($current_tab_store);
      suggestions = result.suggestions;
    });

</script>

<section
  class="flex flex-col {classData} gap-4"
  bind:this={viewport}
  {...rest}
  aria-live="polite"
  role="log"
  aria-label="Zone de discussion avec la conversation {discussion.title}"
>
  <!-- <div class="flex items-center gap-2">
    <time
      class="text-sm text-text font-semibold"
      datetime={new Date().toISOString()}
    >
      Aujourd'hui
    </time>
    <hr class="w-full text-neutral-300" />
  </div> -->

  <!-- {#each discussion.messages.data as message (message.id)} -->
  {#each messages_splited as message }
    {#if message.role === "user"}
      <UserMessageView {message} />
    {:else}
      <AssistantMessageView {message} />
    {/if}
  {:else}
    <EmptyConversation />
    <div class="grid md:grid-cols-2 gap-2">
      {#each suggestions as suggestion (suggestion)}
        <button class="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors text-sm truncate {messages_splited.length % 2 === 0 && "md:last:hidden"}" title={suggestion} onclick={() => {
            input_ref.focus();
            input_ref.value = suggestion;
        }} 
        in:blur
        >
          {suggestion}
        </button>
      {/each}
    </div>
  {/each}

  <div
    class="animate-pulse min-h-20 rounded-lg flex-shrink-0 text-sm px-3 pb-3 mt-3 text-text-light mb-8 transition-colors duration-500 reset-all"
    class:hidden={discussion.status !== "pending" && discussion.status !== "writing"}
    class:bg-background-secondary={discussion.status === "pending"}
    class:my-2={discussion.status === "pending"}
  >
    <!-- TODO: Optimize to not rerender each time -->
    <span class="animate-typing">{@html marked.parse(discussion.bufferMessage.join(""))}</span>
    <!-- {#each discussion.bufferMessage as msg}
      <span class="animate-typing reset-all">{@html msg}</span>
    {/each} -->
  </div>
</section>
