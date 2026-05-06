import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const site = "https://www.hazelduvall.dev";

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // there is a bug where it doesn't get the file page names correct. whoops!
        if (item.url !== site + "/") {
          item.url = item.url + ".html";
        }
        return item;
      },
    }),
  ],
  redirects: {
    "/rss.xml": "/blog/rss.xml",
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  image: {
    domains: ["www.hazelduvall.dev"],
  },
  build: {
    format: "file",
  },
  cacheDir: "./.astro-cache",
});
