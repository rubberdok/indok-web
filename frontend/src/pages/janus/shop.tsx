import { useQuery } from "@apollo/client";
import { CircularProgress, Grid, Typography } from "@mui/material";

import { ShopItem } from "@/components/pages/Janus/Shop/ShopItem";
import { Template } from "@/components/pages/Janus/Template";
import { ProductsDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ShopPage: NextPageWithLayout = () => {
  const { loading, error, data } = useQuery(ProductsDocument);

  if (loading) {
    return (
      <Template title="Janus Nettbutikk" description="">
        <CircularProgress />
      </Template>
    );
  }
  if (error) {
    return (
      <Template title="Janus Nettbutikk" description="">
        <Typography variant="body1" gutterBottom>
          Feil ved lasting av produkter. Vennligst prøv igjen senere. Hvis problemet vedvarer, kontakt
        </Typography>
      </Template>
    );
  }
  if (data === undefined) {
    return (
      <Template title="Janus Nettbutikk" description="">
        <Typography variant="body1" gutterBottom>
          Fant ingen produkter. Vennligst sjekk at du er innlogget og prøv igjen. Hvis problemet vedvarer, kontakt
          leder@rubbedok.no.
        </Typography>
      </Template>
    );
  }
  return (
    <Template title="Janus Nettbutikk" description="">
      <Typography variant="h3" gutterBottom>
        Butikk
        <Grid container spacing={2}>
          {data?.products?.map((product) => {
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
