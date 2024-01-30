import { ApolloError, useMutation } from "@apollo/client";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { graphql } from "@/gql/pages";

type Props = {
  orderId: string;
  onError?: (e?: ApolloError) => void;
  disabled: boolean;
};

export const PayWithVipps: React.FC<Props> = ({ orderId, onError, disabled }) => {
  const [initiateOrder, { error }] = useMutation(
    graphql(`
      mutation PayWithVippsInitiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {
        initiatePaymentAttempt(data: $data) {
          redirectUrl
        }
      }
    `),
    {
      onCompleted: (data) => {
        if (data.initiatePaymentAttempt.redirectUrl) {
          router.push(data.initiatePaymentAttempt.redirectUrl);
        }
      },
      onError: onError,
    }
  );

  const router = useRouter();

  const disable = disabled || !!error;

  return (
    <Card sx={{ maxWidth: 300, background: "inherit" }}>
      <CardActionArea
        onClick={() =>
          initiateOrder({
            variables: {
              data: {
                orderId,
              },
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
