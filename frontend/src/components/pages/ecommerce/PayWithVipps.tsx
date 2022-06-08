import { ApolloError, useMutation } from "@apollo/client";
import { INITIATE_ORDER } from "@graphql/ecommerce/mutations";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  productId: string;
  quantity: number;
  onError?: (e?: ApolloError) => void;
  disabled: boolean;
  fallbackRedirect: string | undefined;
};

const PayWithVipps: React.FC<Props> = ({ productId, quantity, onError, disabled, fallbackRedirect }) => {
  const [initiateOrder, { error }] = useMutation(INITIATE_ORDER, {
    onCompleted: (data) =>
      router.push(data.initiateOrder.redirect || `/ecommerce/fallback?orderId=${data.initiateOrder.orderId}`),
    onError: onError,
  });

  const router = useRouter();

  const disable = disabled || !!error;

  return (
    <Card sx={{ maxWidth: 300, background: "inherit" }}>
      <CardActionArea
        onClick={() =>
          initiateOrder({
            variables: {
              productId,
              quantity,
              ...(fallbackRedirect && { fallbackRedirect }),
            },
          })
        }
        disableRipple
        disabled={disable}
      >
        <CardMedia
          component="img"
          alt="Pay with vipps"
          image="/img/pay_with_vipps_rect_250_NO.svg"
          title="Pay with vipps"
          style={disable ? { opacity: 0.2 } : {}}
        />
      </CardActionArea>
    </Card>
  );
};

export default PayWithVipps;
