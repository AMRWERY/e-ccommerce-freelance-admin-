import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (element) => element.startsWith("iconify-icon"),
        },
      },
    }),
    vueDevTools(),
    Components({}),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/],
      imports: [
        // presets
        "vue",
        "vue-router",
        "pinia",
        "vue-i18n",
        {
          // For vee-validate
          "vee-validate": ["defineRule", "configure"],
          // For @vee-validate/rules, list the rules you want to auto-import
          "@vee-validate/rules": [
            "required",
            "email",
            "min",
            "alpha_spaces",
            "minLength",
            "confirmed",
            "numeric",
            "regex",
          ],
          // For @vee-validate/i18n
          "@vee-validate/i18n": ["localize", "setLocale"],
        },
        // custom
        {
          "[package-name]": [
            "[import-names]",
            // alias
            ["[from]", "[alias]"],
          ],
        },
        // example type import
        {
          from: "vue-router",
          imports: ["RouteLocationRaw"],
          type: true,
        },
      ],
      dirs: ["./hooks", "src/composables", "src/composables", "src/stores", "src/stores/**"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
