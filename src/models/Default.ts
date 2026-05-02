/**
 * Properties used by every Page.
 *
 * Compatible with `MarkdownLayoutProps`, but doesn't actually use all the extra information it provides.
 */
export interface DefaultProps {
  frontmatter: {
    /**
     * Title of the page
     */
    title: string;
    /**
     * Short description of what's on the page, if applicable.
     */
    description?: string;
  };
}
