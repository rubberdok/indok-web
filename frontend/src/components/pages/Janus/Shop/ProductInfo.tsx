import { Card, CardContent, Typography } from "@mui/material";

import { SelectorDisplay } from "./SelectorDisplay";

type Props = {
  price: number;
  sizes?: Array<string>;
  types?: Array<string>;
};

export const ProductInfo: React.VFC<Props> = ({ price, sizes, types }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h6" textAlign="left" padding={1}>
          Pris: {price}
        </Typography>
        <Typography variant="body2" textAlign="left">
          {sizes && <SelectorDisplay selectables={sizes} />}
        </Typography>
        <Typography variant="body2" textAlign="left">
          {types && <SelectorDisplay selectables={types} />}
        </Typography>
      </CardContent>
    </Card>
  );
};
