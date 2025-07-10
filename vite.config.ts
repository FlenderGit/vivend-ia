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
    visualizer({}),
  ],
  resolve: {
    alias: {
      // $components: path.resolve(__dirname, "./src/lib/components"),
      // $stores: "/src/lib/stores",
      // $api: "/src/api",
      // $hooks: path.resolve(__dirname, "./src/lib/hooks"),
      // $utils: "/src/lib/utils",
      // $classes: "/src/lib/classes",
      $lib: path.resolve(__dirname, "src/lib"),
      $components: path.resolve(__dirname, "src/lib/components"),
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
    __VERSION__: JSON.stringify(manifest.version),
  },
  esbuild: {
    drop: ["console", "debugger"],
  }
});
