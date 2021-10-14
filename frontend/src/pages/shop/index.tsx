import { useMutation } from "@apollo/client";
import PayWithVipps from "@components/ecommerce/PayWithVipps";
import Layout from "@components/Layout";
import { CREATE_PRODUCT } from "@graphql/ecommerce/mutations";
import { Product } from "@interfaces/ecommerce";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";

const ShopPage: NextPage = () => {
  const [createProduct] = useMutation<{
    createProduct: { product: Product };
  }>(CREATE_PRODUCT);

  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<string>("1");

  const addProduct = () => {
    createProduct().then((res) => {
      console.log(res.data);
      if (res.data?.createProduct) {
        setProduct(res.data.createProduct.product);
      }
    });
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h1">Vipps test</Typography>
        <Button variant="contained" onClick={() => addProduct()}>
          Add New Product
        </Button>
        <Typography variant="body1">{product ? product.name : "No product"}</Typography>
        <Typography variant="body1">{product ? product.price : "No product"}</Typography>
        <TextField
          id="filled-basic"
          label="Quantity"
          variant="filled"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
        />

        <Typography variant="body1">Test å betale med vipps ved å trykke på knappen!</Typography>
        {product ? <PayWithVipps productId={product.id} quantity={Number(quantity)} /> : <div></div>}
      </Container>
    </Layout>
  );
};

export default ShopPage;
