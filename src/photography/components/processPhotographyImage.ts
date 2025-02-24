import { inferRemoteSize } from "astro:assets";
import type { ImageWithoutDetails } from "../models/Image";

const DEFAULT_MAX_WIDTH = 1024;
const DEFAULT_MAX_HEIGHT = 1024;

export interface PhotographDetails {
  url: string;
  width: number;
  height: number;
}

export interface Photograph extends ImageWithoutDetails, PhotographDetails {}

export const processPhotographyImage = async <I extends ImageWithoutDetails>(
  image: I,
  dir: string,
): Promise<I & PhotographDetails> => {
  if (!image) {
    console.log(dir);
  }
  const url = `https://static.duvallj.pw/photography/${dir}/${image.imgfile}`;
  const { width: remoteWidth, height: remoteHeight } =
    await inferRemoteSize(url);

  const maxWidth = image.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = image.maxHeight ?? DEFAULT_MAX_HEIGHT;

  const width = Math.min(maxWidth, (remoteWidth * maxHeight) / remoteHeight);
  const height = Math.min(maxHeight, (remoteHeight * maxWidth) / remoteWidth);

  return { ...image, width, height, url };
};
