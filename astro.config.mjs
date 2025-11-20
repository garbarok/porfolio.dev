import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import markdoc from "@astrojs/markdoc";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

// https://astro.build/config
export default defineConfig({
  integrations: [
    robotsTxt(),
    sitemap({
      filter: (page) => !page.includes("/components"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        "https://oscargallegoruiz.com/",
        "https://oscargallegoruiz.com/blog/",
      ],
      serialize(item) {
        // Homepage gets highest priority
        if (item.url === "https://oscargallegoruiz.com/") {
          item.changefreq = "monthly";
          item.priority = 1.0;
        }
        // Blog index page
        else if (item.url === "https://oscargallegoruiz.com/blog/") {
          item.changefreq = "weekly";
          item.priority = 0.9;
        }
        // Individual blog posts
        else if (item.url.includes("/blog/")) {
          item.changefreq = "monthly";
          item.priority = 0.8;
        }
        return item;
      },
    }),
    AutoImport({
      imports: [],
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
  },
});
