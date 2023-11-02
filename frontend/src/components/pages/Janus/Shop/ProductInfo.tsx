import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";

type Props = {
  name: string;
  image?: StaticImageData;
  price: number;
};
import cabin from "~/public/static/cabins/00.jpg";

export const ProductInfo: React.VFC<Props> = ({ name, image, price }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 345 }}>
      <CardActionArea href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley">
        <CardMedia>
          <Image src={cabin} style={{ objectFit: "contain", width: "100%", height: "100%" }} alt={""} />
        </CardMedia>
        <CardContent>
          <Typography variant="h5" textAlign="left">
            {name}
          </Typography>
          <Typography variant="body2" textAlign="left" color="text.secondary">
            -, {price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
