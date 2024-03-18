import { useQuery } from "@apollo/client";
import { Alert, Box, Link, Stack } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ProductInfo } from "@/components/pages/Janus/Shop/ProductInfo";
import { PurchaseButton } from "@/components/pages/Janus/Shop/PurchaseButton";
import { Template } from "@/components/pages/Janus/Template";
import { ProductDocument, ProductFragment } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

const ProductPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ product }) => {
  console.log(ProductDocument);
  const { data } = useQuery(ProductDocument, {
    variables: { productId: product.id },
  });
  return (
    <Template title={data?.product?.name?.toString() ?? ""} description="">
      <Stack spacing={2}>
        <Alert variant="filled" severity="info">
          Produktet hentes på Januskontoret. Ved spørsmål kontakt{" "}
          <Link href="mailto:web@janus.org.ntnu.no">web@janus.org.ntnu.no</Link>
        </Alert>

        {/*<Image src={cabin} style={{ objectFit: "contain", width: "100%", height: "100%" }} alt={""} />*/}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 12, sm: 2, md: 8 }}>
          <Box style={{ width: "75%" }}>{data?.product?.description}</Box>
          {/* <ProductInfo price={0} sizes={["S", "M", "L"]} types={["Blue", "Red", "Gray"]} /> */}
        </Stack>
      </Stack>
      <PurchaseButton productId={data?.product?.id ?? ""} />
    </Template>
  );
};

export const getServerSideProps: GetServerSideProps<{ product: ProductFragment }> = async (ctx) => {
  const client = initializeApollo({}, ctx);

  const id = ctx.params?.id;
  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  const { data, error } = await client.query({
    query: ProductDocument,
    variables: {
      productId: id,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const product = data.product;

  if (!product) {
    return {
      notFound: true,
    };
  }

  return addApolloState(client, {
    props: {
      product,
    },
  });
};

export default ProductPage;
