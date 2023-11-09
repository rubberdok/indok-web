import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import { NextLinkComposed } from "@/components/Link";

type Props = {
  product: ProductType;
  image?: StaticImageData;
};
import { ProductType } from "@/generated/graphql";
import cabin from "~/public/static/cabins/00.jpg";

export const ShopItem: React.VFC<Props> = ({ product }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 345 }}>
      <CardActionArea component={NextLinkComposed} key={product.id} to={`/janus/${product.id}`}>
        <CardMedia>
          <Image src={cabin} style={{ objectFit: "contain", width: "100%", height: "100%" }} alt={""} />
        </CardMedia>
        <CardContent>
          <Typography variant="h5" textAlign="left">
            {product.name}
          </Typography>
          <Typography variant="body2" textAlign="left" color="text.secondary">
            -, {product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
