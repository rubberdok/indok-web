import { ApolloError, useMutation } from "@apollo/client";
import { INITIATE_ORDER } from "@graphql/ecommerce/mutations";
import { Card, CardActionArea, CardMedia, CircularProgress, makeStyles, Theme } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

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
  const [initiateOrder, { data, loading, error }] = useMutation(INITIATE_ORDER, { errorPolicy: "all" });

  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error]);

  if (loading) return <CircularProgress />;

  if (data && data.initiateOrder) {
    router.push(data.initiateOrder.redirect);
    return null;
  }

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
