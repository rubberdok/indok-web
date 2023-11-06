import { ProductInfo } from "@/components/pages/Janus/Shop/ProductInfo";
import { Template } from "@/components/pages/Janus/Template";
import { NextPageWithLayout } from "@/lib/next";

const ProductPage: NextPageWithLayout = () => {
  //console.log("Hello World");

  return (
    <Template title="Genser" description="">
      height
      <ProductInfo price={0} sizes={["S", "M", "L"]} types={["Blue", "Red", "Gray"]}></ProductInfo>
    </Template>
  );
};

export default ProductPage;
