import type { PageProps } from "./Page";
import type { PostListProps } from "./PostList";

export interface ArchivePageProps extends PostListProps, PageProps {
  /**
   * The year for which this page of the archive corresponds.
   */
  year: number;
}
