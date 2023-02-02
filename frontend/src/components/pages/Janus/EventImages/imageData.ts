import { StaticImageData } from "next/future/image";

import _00 from "~/public/static/cabins/00.jpg";

export type ImageData = {
  label: string;
  img: StaticImageData;
};

/** Data with all paths, labels and descriptions for images used in the image slider. */

//Change this when adding new images
export const immballImages: ImageData[] = [
  {
    label: "Immatrikulering",
    img: _00,
  },
];

export const winterGamesImages: ImageData[] = [
  {
    label: "Winter Games",
    img: _00,
  },
];

export const janusvalgetImages: ImageData[] = [
  {
    label: "Janusvalget",
    img: _00,
  },
];

export const aareturImages: ImageData[] = [
  {
    label: "Åretur",
    img: _00,
  },
];

export const borsfestImages: ImageData[] = [
  {
    label: "Børsfest",
    img: _00,
  },
];
