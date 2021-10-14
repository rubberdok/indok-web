import { Card, CardActionArea, CardMedia, CircularProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { INITIATE_ORDER } from "@graphql/ecommerce/mutations";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 300,
    background: "inherit",
  },
}));

interface Props {
  productId: string;
  quantity: number;
}

const PayWithVipps: React.FC<Props> = ({ productId, quantity }) => {
  const [initiateOrder, { data, loading, error }] = useMutation(INITIATE_ORDER);

  const classes = useStyles();
  const router = useRouter();

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
      {error && <Typography>{error.message}</Typography>}
    </Card>
  );
};

export default PayWithVipps;
