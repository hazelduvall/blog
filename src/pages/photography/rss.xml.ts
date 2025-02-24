import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { getPhotography } from "../../data/photography";

export async function GET(context: APIContext) {
  // From https://blog.damato.design/posts/astro-rss-mdx/
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const pages = await getPhotography();
  const items = await Promise.all(
    pages.map(async (page) => {
      const { Content } = await render(page.entry);
      const content = await container.renderToString(Content);
      // TODO: centralize link formatting
      const link = new URL(
        `/photography/${page.id}.html`,
        context.url.origin,
      ).toString();
      return {
        link,
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        title: page.title,
        pubDate: new Date(page.date * 1000),
        description: page.description,
      };
    }),
  );

  return rss({
    title: "Jack Duvall's Photography",
    description: "these are some photos yes",
    site: context.site
      ? new URL("/photography.html", context.site)
      : "https://blog.duvallj.pw/photography.html",
    items: items.reverse(),
    customData: `<language>en-us</language>`,
  });
}
