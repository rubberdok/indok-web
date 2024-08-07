import { ApolloError, useMutation } from "@apollo/client";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { InitiateOrderDocument } from "@/generated/graphql";

type Props = {
  productId: string;
  quantity: number;
  onError?: (e?: ApolloError) => void;
  disabled: boolean;
  fallbackRedirect: string | undefined;
};

export const PayWithVipps: React.FC<Props> = ({ productId, quantity, onError, disabled, fallbackRedirect }) => {
  const [initiateOrder, { error }] = useMutation(InitiateOrderDocument, {
    onCompleted: (data) => {
      if (data.initiateOrder) {
        router.push(data.initiateOrder?.redirect || `/ecommerce/fallback?orderId=${data.initiateOrder.orderId}`);
      }
    },
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
          alt="Betal med Vipps"
          image="/img/pay_with_vipps_rect_250_NO.svg"
          title="Pay with vipps"
          style={disable ? { opacity: 0.2 } : {}}
        />
      </CardActionArea>
    </Card>
  );
};
