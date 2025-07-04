import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
// import { crx } from "@crxjs/vite-plugin";
// import manifest from "./manifest.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // crx({ manifest}),
    tailwindcss(),
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
    visualizer({}),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  base: "",
});
