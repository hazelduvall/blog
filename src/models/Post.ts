import type { DefaultProps } from "./Default";
import type { Page } from "./Page";

export interface Post extends Page {
  /**
   * The URL-friendly name for the post. Usually formatted like "YYYY-MM-DD-some-title"
   */
  slug: string;
  /**
   * The date the post was first published, if applicable
   */
  date: Date;
  /**
   * The tags associated with the post
   */
  tags: string[];
}

export interface PostProps extends DefaultProps {
  previous?: Post;
  current: Post;
  next?: Post;
}
