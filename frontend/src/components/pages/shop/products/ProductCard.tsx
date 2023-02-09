import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";

import { Product } from "./types";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card>
      <Box p={5}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider />
        <img src={product.image.src} alt={product.image.alt} width={100} height={100} />
        <Divider />
        <Typography variant="body1">{product.description}</Typography>
        <Divider />
        <Grid container spacing={2} marginTop={2} marginBottom={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Antall: {product.current_quantity}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" align="right">
              Pris: {product.price} kr
            </Typography>
          </Grid>
        </Grid>
        <Button variant="contained" fullWidth>
          Kjøp
        </Button>
      </Box>
    </Card>
  );
};
