import type { PageProps } from "./Page";
import type { PostListProps } from "./PostList";

export interface TagPageProps extends PostListProps, PageProps {
  tag: string;
}
