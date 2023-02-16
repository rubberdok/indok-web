import { RequireContext } from "@types/webpack";
import React, { useState } from "react";

interface Image {
  file_name: string;
  url: string;
}

const ImageGallery: React.FC = () => {
  function importAll(r: __WebpackModuleApi.RequireContext): { [key: string]: string } {
    const images: { [key: string]: string } = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(require.context("./images", false, /\.(png|jpe?g|svg)$/));

  return (
    <div>
      {images.map((image) => (
        <img key={image.file_name} src={image.url} alt={image.file_name} />
      ))}
    </div>
  );
};

export default ImageGallery;
