<script lang="ts">
    import { current_tab_store } from "$lib/stores/current_tab";
    import { t } from "$lib/utils/i18n";
    import Icon from "@iconify/svelte";
</script>

<div class="flex-1 flex flex-center flex-col gap-1">
    <div class="bg-primary rounded-full size-16 text-white flex flex-center">
        <Icon icon="mdi:robot-happy-outline" class="text-4xl" />
    </div>
    <p class="text-lg font-semibold">
        {t("ui_welcome", $current_tab_store?.hostname ?? "no host found")}
    </p>
    <p class="text-neutral-500 text-sm">{t("helping_user_question")}</p>
</div>

