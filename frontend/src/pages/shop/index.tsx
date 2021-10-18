import { useMutation } from "@apollo/client";
import PayWithVipps from "@components/ecommerce/PayWithVipps";
import Layout from "@components/Layout";
import { CREATE_PRODUCT } from "@graphql/ecommerce/mutations";
import { Product } from "@interfaces/ecommerce";
import { Button, Card, Container, TextField, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";

const ShopPage: NextPage = () => {
  const [createProduct, { data, error }] = useMutation<{
    createProduct: { product: Product };
  }>(CREATE_PRODUCT);

  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<string>("1");

  if (data && data.createProduct && data.createProduct.product !== product) {
    setProduct(data.createProduct.product);
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Vipps test</Typography>
        <Button variant="contained" onClick={() => createProduct().catch((e) => console.log(e))}>
          Add New Product
        </Button>
        {product ? (
          <>
            <Typography>Navn: {product.name}</Typography>
            <Typography>Beskrivelse: {product.description}</Typography>
            <Typography>Pris: {product.price}</Typography>
            <Typography>Totalt antall: {product.totalQuantity}</Typography>
            <Typography>Maks antall lov å kjøpe: {product.maxBuyableQuantity}</Typography>
          </>
        ) : (
          <Typography>No Product</Typography>
        )}
        {error && <Typography color="error">{error.message}</Typography>}
        {product && (
          <>
            <TextField
              id="filled-basic"
              label="Quantity"
              variant="filled"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
            />
            <Typography>Test å betale med vipps ved å trykke på knappen!</Typography>
            <PayWithVipps productId={product.id} quantity={Number(quantity)} />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default ShopPage;
