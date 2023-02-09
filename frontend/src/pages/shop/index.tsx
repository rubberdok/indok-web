import { Container, Grid, Typography } from "@mui/material";

import { ProductCard } from "@/components/pages/shop/products/ProductCard";
import { Product } from "@/components/pages/shop/products/types";
import { ShopTemplate } from "@/components/pages/shop/ShopTemplate";
import { Layout, RootStyle } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/pages/_app";

const ShopPage: NextPageWithLayout = () => {
  const exampleProducts: Product[] = [
    {
      id: 1,
      name: "Janusgenser",
      price: 200,
      description: "En lyseblå genser med Indøk logoen på brystet. Genseren er laget av 100% bomull.",
      organizationId: 19,
      total_quantity: 100,
      current_quantity: 100,
      max_buyable_quantity: 1,
      image: {
        src: "https://images.unsplash.com/photo-1626126090003-8e1b2f2b2f1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        alt: "s",
      },
    },
    {
      id: 2,
      name: "Janusgenser",
      price: 200,
      description: "En lyseblå genser med Indøk logoen på brystet. Genseren er laget av 100% bomull.",
      organizationId: 19,
      total_quantity: 100,
      current_quantity: 100,
      max_buyable_quantity: 1,
      image: {
        src: "https://images.unsplash.com/photo-1626126090003-8e1b2f2b2f1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        alt: "s",
      },
    },
    {
      id: 3,
      name: "Janusgenser",
      price: 200,
      description: "En lyseblå genser med Indøk logoen på brystet. Genseren er laget av 100% bomull.",
      organizationId: 19,
      total_quantity: 100,
      current_quantity: 100,
      max_buyable_quantity: 1,
      image: {
        src: "https://images.unsplash.com/photo-1626126090003-8e1b2f2b2f1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        alt: "s",
      },
    },
    {
      id: 4,
      name: "Janusgenser",
      price: 200,
      description: "En lyseblå genser med Indøk logoen på brystet. Genseren er laget av 100% bomull.",
      organizationId: 19,
      total_quantity: 100,
      current_quantity: 100,
      max_buyable_quantity: 1,
      image: {
        src: "https://images.unsplash.com/photo-1626126090003-8e1b2f2b2f1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        alt: "s",
      },
    },
  ];

  return (
    <ShopTemplate title="Nettbutikk" description="Kjøp Indøk Merchandise">
      <Container>
        <Grid container spacing={3}>
          {exampleProducts.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ShopTemplate>
  );
};

ShopPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default ShopPage;
