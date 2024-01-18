import { useQuery } from "@apollo/client";
import { Box, Stack } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ProductInfo } from "@/components/pages/Janus/Shop/ProductInfo";
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
    <Template title="Genser" description="">
      <Stack spacing={2}>
        <Box
          sx={{
            width: 750,
            height: 250,
            borderRadius: 1,
            bgcolor: "primary.main",
          }}
        >
          {/*<Image src={cabin} style={{ objectFit: "contain", width: "100%", height: "100%" }} alt={""} />*/}
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 12, sm: 2, md: 8 }}>
          <Box style={{ width: "75%" }}>{data?.product?.description}</Box>
          <ProductInfo price={0} sizes={["S", "M", "L"]} types={["Blue", "Red", "Gray"]} />
        </Stack>
      </Stack>
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
