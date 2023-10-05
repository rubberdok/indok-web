import { Box, Typography } from "@mui/material";


import { Template } from "@/components/pages/Janus/Template";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const ShopPage: NextPageWithLayout = () => {
  return (
    <Template title="Janusshop" description=":)">
      <Typography variant="h3" gutterBottom>
        Butikk
      </Typography>

    </Template>
  );
};

ShopPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShopPage;
