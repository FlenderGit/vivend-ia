<script lang="ts">
  import type { ConversationData } from "../../types";

    type Props = {
        conversation: ConversationData;
    }

    const { conversation = $bindable() }: Props = $props();
</script>

<form>
    <label>
        Title
    </label>
    <label>
        Icon
    </label>
</form>