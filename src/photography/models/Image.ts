import { z } from "astro:content";

export const ImageWithoutDetails = z.object({
  /**
   * Filename for the image. MUST be relative to https://static.duvallj.pw/photography/<dir>/
   */
  imgfile: z.string(),
  /**
   * title component for the image (text that shows up on hover)
   */
  imgtitle: z.string().optional(),
  /**
   * alt component for the image (text for screenreaders)
   */
  imgalt: z.string(),
  /**
   * Whether this above-the-fold image should be eagerly loaded
   */
  eager: z.boolean().optional(),
  /**
   * Maximum width of the rendered image (in px)
   */
  maxWidth: z.number().optional(),
  /**
   * Maximum height of the rendered image (in px)
   */
  maxHeight: z.number().optional(),
  /**
   * If provided, allows an image to scroll in the X direction instead of being scaled down.
   */
  scrollX: z.boolean().optional(),
  /**
   * If provided, scales the image down in the Y direction by forcing it to have more margin, so that it doesn't appear so tall
   */
  marginY: z.string().optional(),
});
export type ImageWithoutDetails = z.infer<typeof ImageWithoutDetails>;

export const ImageDetails = z.object({
  /**
   * Image title (above the image)
   */
  title: z.string(),
  /**
   * Image caption (below the image)
   */
  caption: z.string(),
});
export type ImageDetails = z.infer<typeof ImageDetails>;
