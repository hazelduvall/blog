import pluginJavascript from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import pluginTypescript from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", ".github/**", ".astro/**"],
  },
  pluginJavascript.configs.recommended,
  pluginTypescript.configs.recommended,
  ...pluginAstro.configs.recommended,
  ...pluginAstro.configs["jsx-a11y-recommended"],
  configPrettier,
]);
