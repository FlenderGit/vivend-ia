<script lang="ts">
    type Props = {
        open?: boolean;
    }

    let { open = $bindable(false) }: Props = $props();
</script>

<div class="absolute inset-0 bg-amber-200 transition-transform  duration-300 ease-in-out"
    class:translate-x-[-100%]={!open}
>

    <h2>Sidebar</h2>
    <ul>
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a></li>
        <li><a href="#section3">Section 3</a></li>
    </ul>
</div>