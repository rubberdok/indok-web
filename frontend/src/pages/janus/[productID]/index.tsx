import { Typography } from "@mui/material";
import { useRouter } from "next/router";

import { Template } from "@/components/pages/Janus/Template";
import { NextPageWithLayout } from "@/lib/next";

const ProductPage: NextPageWithLayout = () => {
  //console.log("Hello World");

  return (
    <Template title="Genser" description="">
      hei
    </Template>
  );
};

export default ProductPage;
