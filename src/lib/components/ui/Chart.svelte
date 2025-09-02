<script lang="ts">
    import { onMount } from "svelte";
    import { BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, type ChartConfiguration } from "chart.js";

    type Props = {
        config: ChartConfiguration
    }

    const { config }: Props = $props();

    Chart.register(LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

    let chart_ref: HTMLCanvasElement;

    onMount(() => {
        const ctx = chart_ref.getContext("2d");
        if (ctx) {
            new Chart(ctx, config);
        } else {
            console.error("Failed to get canvas context");
        }
    })

</script>

<canvas bind:this={chart_ref}></canvas>