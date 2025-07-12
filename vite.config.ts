import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    crx({ manifest,
      contentScripts: {
        injectCss: true,
      }
    }),
    tailwindcss(),
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
    visualizer({
      filename: "generated/stats.html",
    }),
  ],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, "src/lib"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // base: "",
  define: {
    __APP_NAME__: JSON.stringify(manifest.name),
    __VERSION__: JSON.stringify(manifest.version),
  },
  esbuild: {
    drop: ["console", "debugger"],
  }
});
