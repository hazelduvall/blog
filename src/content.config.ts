import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { ImageList } from "./photography/models/ImageList";

const posts = defineCollection({
  // TODO: I'd like to convert all mdx files (which just use RawSnippet) to plain md files and use a remark/rehype plugin instead.
  loader: glob({ pattern: "[^_]*.{md,mdx}", base: "src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.string(),
  }),
});

const photography = defineCollection({
  loader: glob({ pattern: "[^_]*.mdx", base: "src/content/photography" }),
  schema: ImageList.extend({
    title: z.string(),
    description: z.string(),
    // The value of `Date.now() / 1000` when the post was published. Used for reverse-chronological sorting.
    date: z.number(),
  }),
});

export const collections = {
  posts,
  photography,
};
