import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { getPosts } from "../../data/posts";

export async function GET(context: APIContext) {
  // From https://blog.damato.design/posts/astro-rss-mdx/
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post.entry);
      const content = await container.renderToString(Content);
      const link = new URL(post.current.url, context.url.origin).toString();
      return {
        link,
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        title: post.current.title,
        pubDate: post.current.date,
        description: post.frontmatter.description,
        categories: post.current.tags,
      };
    }),
  );

  return rss({
    title: "Hazel Duvall's Blog",
    description: "this is a site yes",
    site: context.site
      ? new URL("/blog.html", context.site)
      : "https://www.hazelduvall.dev/blog.html",
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
