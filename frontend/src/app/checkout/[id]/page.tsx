"use client";

import { graphql } from "@/gql/app";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { VippsCheckoutButton } from "./VippsCheckoutButton";
import { config } from "@/utils/config";
import { OrderPaymentStatus } from "@/gql/app/graphql";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const { data } = useSuspenseQuery(
    graphql(`
      query order($data: OrderInput!) {
        order(data: $data) {
          order {
            id
            product {
              id
              name
            }
            paymentStatus
            isFinalState
            totalPrice {
              value
              unit
              valueInNok
            }
          }
        }
      }
    `),
    { variables: { data: { id } } }
  );

  const [initiatePaymentAttempt] = useMutation(
    graphql(`
      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {
        initiatePaymentAttempt(data: $data) {
          redirectUrl
        }
      }
    `),
    {
      variables: {
        data: {
          orderId: id,
          returnUrl: new URL(`/receipt/${id}`, config.FRONTEND_URI).toString(),
        },
      },
      onCompleted({ initiatePaymentAttempt: { redirectUrl } }) {
        router.push(redirectUrl);
      },
    }
  );

  const { order } = data.order;
  const { product } = order;

  if (order.paymentStatus === OrderPaymentStatus.Captured) {
    router.push(`/receipt/${id}`);
  }

  return (
    <>
      <Container maxWidth="sm"></Container>
      <Card>
        <CardHeader title="Bekreft bestilling" />
        <CardContent>
          <Typography variant="h6">Produkt:</Typography>
          <Typography>{product.name}</Typography>
          <Typography variant="h6">Totalpris:</Typography>
          <Typography>
            {order.totalPrice.value} {order.totalPrice.unit}
          </Typography>
          <Typography variant="h6">Betalingsstatus:</Typography>
          <Typography>{order.paymentStatus}</Typography>
          <Stack spacing={2} direction="row">
            <VippsCheckoutButton onClick={initiatePaymentAttempt} />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
