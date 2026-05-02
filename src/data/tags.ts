import { getPosts, type PostPropsWithEntry } from "./posts";

/**
 * Sorts all posts into buckets based on tag, preserving order within each bucket
 */
export const getPostsByTag = async (): Promise<
  Map<string, PostPropsWithEntry[]>
> => {
  const posts = await getPosts();
  const output = new Map<string, PostPropsWithEntry[]>();
  posts.forEach((post) => {
    post.current.tags.forEach((tag) => {
      if (!tag) {
        return;
      }
      const list = output.get(tag) ?? [];
      list.push(post);
      output.set(tag, list);
    });
  });
  return output;
};
