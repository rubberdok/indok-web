import { Typography } from "@mui/material";
import { useRouter } from "next/router";

import { ProductInfo } from "@/components/pages/Janus/Shop/ProductInfo";
import { Template } from "@/components/pages/Janus/Template";
import { NextPageWithLayout } from "@/lib/next";

const ProductPage: NextPageWithLayout = () => {
  //console.log("Hello World");

  return (
    <Template title="Genser" description="">
      height
      <ProductInfo name={""} price={0}></ProductInfo>
    </Template>
  );
};

export default ProductPage;
