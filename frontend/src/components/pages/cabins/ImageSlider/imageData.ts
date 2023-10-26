import { StaticImageData } from "next/image";

import _00 from "~/public/static/cabins/00.jpg";
import _01 from "~/public/static/cabins/01.jpg";
import _02 from "~/public/static/cabins/02.jpg";
import _03 from "~/public/static/cabins/03.jpg";
import _04 from "~/public/static/cabins/04.jpg";
import _05 from "~/public/static/cabins/05.jpg";
import _06 from "~/public/static/cabins/06.jpg";
import _07 from "~/public/static/cabins/07.jpg";
import _08 from "~/public/static/cabins/08.jpg";
import _09 from "~/public/static/cabins/09.jpg";
import _10 from "~/public/static/cabins/10.jpg";
import _11 from "~/public/static/cabins/11.jpg";
import _20 from "~/public/static/cabins/20.jpg";
import _21 from "~/public/static/cabins/21.jpg";
import _22 from "~/public/static/cabins/22.jpg";

export type ImageData = {
  label: string;
  img: StaticImageData;
};

/** Data with all paths, labels and descriptions for images used in the image slider. */
export const outsideImages: ImageData[] = [
  {
    label: "Fjell",
    img: _20,
  },
  {
    label: "Skiløyper",
    img: _21,
  },
  {
    label: "Sosialt på fjellet",
    img: _22,
  },
];

export const cabinImages: ImageData[] = [
  {
    label: "Hytta",
    img: _00,
  },
  {
    label: "Utsikt",
    img: _01,
  },
  {
    label: "Stue",
    img: _02,
  },
  {
    label: "Kjøkken",
    img: _03,
  },
  {
    label: "Kjøkken",
    img: _04,
  },
  {
    label: "Bad",
    img: _05,
  },
  {
    label: "Bad",
    img: _06,
  },
  {
    label: "Badstue",
    img: _07,
  },
  {
    label: "Soverom",
    img: _08,
  },
  {
    label: "Soverom",
    img: _09,
  },
  {
    label: "Soverom",
    img: _10,
  },
  {
    label: "Soverom",
    img: _11,
  },
];
