import { Cloudinary } from "@cloudinary/url-gen";
import { blur } from "@cloudinary/url-gen/actions/effect";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { StaticImageData } from "next/image";

export const cld = new Cloudinary({
  cloud: {
    cloudName: "rubberdok",
  },
});

/**
 * Get blurred image from cloudinary
 */
export const getBlurUrl = (image: StaticImageData | string) => {
  return cld
    .image(`${typeof image === "string" ? image : image.src}`)
    .format("webp")
    .effect(blur(2000))
    .quality("auto")
    .resize(scale().width(10))
    .toURL();
};
