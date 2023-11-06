import { Image } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { ProductInfo } from "@/components/pages/Janus/Shop/ProductInfo";
import { Template } from "@/components/pages/Janus/Template";
import { NextPageWithLayout } from "@/lib/next";
import cabin from "~/public/static/cabins/00.jpg";

const ProductPage: NextPageWithLayout = () => {
  //console.log("Hello World");

  return (
    <Template title="Genser" description="">
      <Image src={cabin} style={{ objectFit: "contain", width: "20%", height: "20%" }} alt={""} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 12, sm: 2, md: 8 }}>
        <Box style={{ width: "75%" }}>
          Fette janus genser in verschiedenen Farbe; Erhältlich in Deutschland, Österreich und der Schweiz; Wieder mal
          nicht lange nach den Ziel gesucht; Wie immer 3, 4 Sterne an der Playa gebucht; Endlich angekommen da am
          geilsten Strand der Welt, wird ein Bier bestellt; Cerveza!
        </Box>
        <ProductInfo price={0} sizes={["S", "M", "L"]} types={["Blue", "Red", "Gray"]} />
      </Stack>
    </Template>
  );
};

export default ProductPage;
