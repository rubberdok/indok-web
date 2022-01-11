import { ApolloError, useMutation } from "@apollo/client";
import { INITIATE_ORDER } from "@graphql/ecommerce/mutations";
import { Card, CardActionArea, CardMedia, CircularProgress, makeStyles, Theme } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 300,
    background: "inherit",
  },
}));

interface Props {
  productId: string;
  quantity: number;
  onError?: (e?: ApolloError) => void;
}

const PayWithVipps: React.FC<Props> = ({ productId, quantity, onError }) => {
  const [initiateOrder, { loading }] = useMutation(INITIATE_ORDER, {
    onCompleted: (data) =>
      router.push(data.initiateOrder.redirect || `/ecommerce/fallback?orderId=${data.initiateOrder.orderId}`),
    onError: onError,
  });

  const classes = useStyles();
  const router = useRouter();

  if (loading) return <CircularProgress />;

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => initiateOrder({ variables: { productId, quantity } })} disableRipple>
        <CardMedia
          component="img"
          alt="Pay with vipps"
          image="/img/pay_with_vipps_rect_250_NO.svg"
          title="Pay with vipps"
        />
      </CardActionArea>
    </Card>
  );
};

export default PayWithVipps;
