import { z } from "astro:content";
import { ImageDetails, ImageWithoutDetails } from "./Image";

/** Show a single image */
export const BasicImage = ImageDetails.merge(ImageWithoutDetails).extend({
  layout: z.undefined(),
});
export type BasicImage = z.infer<typeof BasicImage>;

/** Shows many images side-by-side. */
export const PairedImages = ImageDetails.extend({
  layout: z.literal("pair"),

  images: ImageWithoutDetails.array(),
});
export type PairedImages = z.infer<typeof PairedImages>;

/** Shows many images in a grid layout. */
export const GridImages = ImageDetails.extend({
  layout: z.literal("grid"),

  images: ImageWithoutDetails.array().array(),
});
export type GridImages = z.infer<typeof GridImages>;

export const Image = z.discriminatedUnion("layout", [
  BasicImage,
  GridImages,
  PairedImages,
]);
export type Image = z.infer<typeof Image>;

export const ImageList = z.object({
  images: Image.array(),
  // MUST be relative to https://static.duvallj.pw/photography
  dir: z.string(),
});
export type ImageList = z.infer<typeof ImageList>;
