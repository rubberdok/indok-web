import { Box, ButtonBase, Stack, Typography } from "@mui/material";

import { Template } from "@/components/pages/Janus/Template";
import { ShopItem } from '@/components/pages/Janus/Shop/ShopItem';
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ShopPage: NextPageWithLayout = () => {
  return (
    <Template title="Janus Nettbutikk" description="">
      <Typography variant="h3" gutterBottom>
        Butikk
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <ShopItem name="hytte"></ShopItem>
            <ShopItem name="hytte"></ShopItem>
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <ShopItem name="hytte"></ShopItem>
            <ShopItem name="hytte"></ShopItem>
          </Stack>
        </Stack>

      </Typography>

    </Template>
  );
};

ShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShopPage;
