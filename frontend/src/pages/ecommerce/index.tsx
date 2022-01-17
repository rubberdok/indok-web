import { useMutation } from "@apollo/client";
import PayWithVipps from "@components/ecommerce/PayWithVipps";
import Layout from "@components/Layout";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { CREATE_PRODUCT } from "@graphql/ecommerce/mutations";
import { Product } from "@interfaces/ecommerce";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";

const ShopPage: NextPage = () => {
  const [createProduct] = useMutation<{
    createProduct: { product: Product };
  }>(CREATE_PRODUCT, { onCompleted: (data) => setProduct(data.createProduct.product) });

  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<string>("1");
  const [orderError, setOrderError] = useState<string>("");

  return (
    <Layout>
      <PermissionRequired permission="ecommerce.add_product">
        <Container>
          <Typography variant="h1">Vipps test</Typography>
          <Button
            variant="contained"
            onClick={() => {
              createProduct();
              setOrderError("");
            }}
          >
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
          {orderError && <Typography color="error">{orderError}</Typography>}
          {product && (
            <>
              <TextField
                id="filled-basic"
                label="Quantity"
                variant="filled"
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
              />
              <PayWithVipps
                productId={product.id}
                quantity={Number(quantity)}
                onError={(e) => e && setOrderError(e.message)}
              />
            </>
          )}
        </Container>
      </PermissionRequired>
    </Layout>
  );
};

export default ShopPage;
