import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { Post, PostProps } from "../models/Post";

export interface PostPropsWithEntry extends PostProps {
  entry: CollectionEntry<"posts">;
}

export const getPosts = async () => {
  const rawPosts = await getCollection("posts");
  const posts = rawPosts.map((post) => {
    const slug = post.id;
    const title = post.data.title ?? "untitled";

    const current: Post = {
      url: `/blog/posts/${slug}.html`,
      title,
      slug,
      date: new Date(slug.slice(0, 10) + "T12:00:00"),
      tags: (post.data.tags ?? "").split(", "),
    };

    return {
      entry: post,
      current,
      previous: undefined as Post | undefined,
      next: undefined as Post | undefined,
      frontmatter: {
        title,
        description: post.data.description,
      },
    };
  });

  posts.sort(
    (postA, postB) =>
      postA.current.date.valueOf() - postB.current.date.valueOf(),
  );

  posts.forEach((post, i) => {
    if (i > 0) {
      post.previous = posts[i - 1]!.current;
    }
    if (i < posts.length - 1) {
      post.next = posts[i + 1]!.current;
    }
  });

  return posts;
};
