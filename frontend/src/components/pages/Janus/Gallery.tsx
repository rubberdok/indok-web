import axios from "axios";
import React, { useState } from "react";

interface Image {
  file_name: string;
  url: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  return (
    <div>
      {images.map((image) => (
        <img key={image.file_name} src={image.url} alt={image.file_name} />
      ))}
    </div>
  );
};

export default ImageGallery;
