import Layout from "@components/Layout";
import { Card, CardActionArea, CardMedia, Container, makeStyles, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
    background: "inherit",
  },
  button: {},
}));

const ShopPage: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Layout>
      <Container>
        <Typography variant="h1">Vipps test</Typography>
        <Typography variant="body1">Test å betale med vipps ved å trykke på knappen!</Typography>
        <Card className={classes.root}>
          <CardActionArea
            onClick={() => {
              fetch("http://localhost:8000/vipps/order/", { credentials: "include", cache: "no-cache" })
                .then((res) => {
                  return res.json();
                })
                .then((data) => {
                  router.push(data.redirect);
                });
            }}
            disableRipple
          >
            <CardMedia
              component="img"
              alt="Pay with vipps"
              image="/img/pay_with_vipps_rect_250_NO.svg"
              title="Pay with vipps"
            />
          </CardActionArea>
        </Card>
      </Container>
    </Layout>
  );
};

export default ShopPage;
