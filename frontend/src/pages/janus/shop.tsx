import { useQuery } from "@apollo/client";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";

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
        <Stack spacing={2}>
          {data?.products?.map((product) => {
            console.log(product);
            return <ShopItem key={product.id} name={product.name} price={product.price}></ShopItem>;
          })}
          <Stack direction={"row"} spacing={2}>
            <ShopItem name="hytte" price={0}></ShopItem>
            <ShopItem name="hytte" price={0}></ShopItem>
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <ShopItem name="hytte" price={0}></ShopItem>
            <ShopItem name="hytte" price={0}></ShopItem>
          </Stack>
        </Stack>
      </Typography>
    </Template>
  );
};

ShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShopPage;
