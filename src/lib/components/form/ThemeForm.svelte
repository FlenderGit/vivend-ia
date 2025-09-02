<script lang="ts">
  import { theme_store } from "../../stores/theme";

  const FONTS = {
    "Default": "ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol;",
   "Arial": "Arial, sans-serif",
   "Courier New": "Courier New, monospace",
   "Georgia": "Georgia, serif",
   "Times New Roman": "Times New Roman, serif",
   "Verdana": "Verdana, sans-serif",
   "Roboto": "Roboto, sans-serif",
  };

  const googleFonts = [
    // Sans-serif
    { name: 'Roboto', category: 'sans-serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Lato', category: 'sans-serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Source Sans Pro', category: 'sans-serif' },
    { name: 'Raleway', category: 'sans-serif' },
    { name: 'Poppins', category: 'sans-serif' },
    { name: 'Nunito', category: 'sans-serif' },
    { name: 'Ubuntu', category: 'sans-serif' },
    { name: 'Roboto Condensed', category: 'sans-serif' },
    { name: 'Noto Sans', category: 'sans-serif' },
    { name: 'Fira Sans', category: 'sans-serif' },
    { name: 'Inter', category: 'sans-serif' },
    { name: 'Work Sans', category: 'sans-serif' },
    
    // Serif
    { name: 'Roboto Slab', category: 'serif' },
    { name: 'Merriweather', category: 'serif' },
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Lora', category: 'serif' },
    { name: 'Source Serif Pro', category: 'serif' },
    { name: 'PT Serif', category: 'serif' },
    { name: 'Crimson Text', category: 'serif' },
    { name: 'Libre Baskerville', category: 'serif' },
    
    // Display
    { name: 'Oswald', category: 'display' },
    { name: 'Pacifico', category: 'display' },
    { name: 'Dancing Script', category: 'display' },
    { name: 'Lobster', category: 'display' },
    { name: 'Righteous', category: 'display' },
    { name: 'Bebas Neue', category: 'display' },
    { name: 'Permanent Marker', category: 'display' },
    
    // Monospace
    { name: 'Roboto Mono', category: 'monospace' },
    { name: 'Source Code Pro', category: 'monospace' },
    { name: 'Fira Code', category: 'monospace' },
    { name: 'JetBrains Mono', category: 'monospace' },
    
    // Handwriting
    { name: 'Kalam', category: 'handwriting' },
    { name: 'Shadows Into Light', category: 'handwriting' },
    { name: 'Indie Flower', category: 'handwriting' }
];

</script>

<form>
  <select bind:value={$theme_store.font}>
    {#each googleFonts as { name }}
      <option value={name}>{name}</option>
    {/each}
    <!-- {#each Object.entries(FONTS) as [name, value]}
      <option value={value}>{name}</option>
    {/each} -->
  </select>

  <!-- {#each COLORS_TYPE as type}
    <label>
      {type}
      <input type="color" disabled />
    </label>
  {/each} -->
</form> 
