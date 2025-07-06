<script lang="ts">
  import { COLORS_TYPE, THEMES } from "../../constants/themes";
  import { theme_store } from "../../stores/theme";
</script>

<form>
  <select onchange={e => {
    if (!e?.target) return;
    theme_store.set(THEMES[e.target.value] || THEMES.default);
  }}>
    {#each Object.keys(THEMES) as theme}
      <option value={theme}>{theme}</option>
    {/each}
  </select>

  {#each COLORS_TYPE as type}
    <label>
      {type}
      <input type="color" disabled />
    </label>
  {/each}
</form>
