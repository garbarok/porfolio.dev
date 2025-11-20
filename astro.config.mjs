import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";
import markdoc from "@astrojs/markdoc";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [robotsTxt(), sitemap(), partytown(), mdx(), markdoc()],
  site: "https://porfolio.dev/",

  vite: {
    plugins: [tailwindcss()],
  },
});
