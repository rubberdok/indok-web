import { useQuery } from "@apollo/client";
import { Grid, Typography } from "@mui/material";

import { ShopItem } from "@/components/pages/Janus/Shop/ShopItem";
import { Template } from "@/components/pages/Janus/Template";
import { ProductsDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ShopPage: NextPageWithLayout = () => {
  const { data } = useQuery(ProductsDocument);

  return (
    <Template title="Janus Nettbutikk" description="">
      <Typography variant="h3" gutterBottom>
        Butikk
        <Grid container spacing={2}>
          {data?.products?.map((product) => {
            console.log(product);
            if (product.shopItem === true)
              return (
                <Grid key={product.id} item xs={12} sm={6} md={6}>
                  <ShopItem key={product.id} product={product}></ShopItem>
                </Grid>
              );
          })}
        </Grid>
      </Typography>
    </Template>
  );
};

ShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShopPage;
