import { StaticImageData } from "next/image";

import _00 from "~/public/img/ferrari.jpg";
import _01 from "~/public/img/ferrari.jpg";
import _02 from "~/public/img/ferrari.jpg";

export type ImageData = {
  label: string;
  img: StaticImageData;
};

export const cabinImages: ImageData[] = [
  {
    label: "Bil",
    img: _00,
  },
  {
    label: "Bil",
    img: _01,
  },
  {
    label: "Bil",
    img: _02,
  },
];
