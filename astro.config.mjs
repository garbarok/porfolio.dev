import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import markdoc from "@astrojs/markdoc";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  output: "static",

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    robotsTxt(),
    sentry({
      project: "porfolio-blog",
      org: "oscar-gallego",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es",
          en: "en",
        },
      },
    }),
    mdx(),
    markdoc(),
  ],

  site: "https://oscargallegoruiz.com/",

  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    sourcemap: true,
  },
});
