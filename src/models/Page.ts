import type { DefaultProps } from "./Default";

/**
 * Metadata for an arbitrary Page
 */
export interface Page {
  /**
   * URL of the page. Must start with a '/'.
   */
  url: string;
  /**
   * Title of the page.
   */
  title: string;
}

export interface PageProps extends DefaultProps {
  inList?: boolean;
  previous?: Page;
  next?: Page;
}
