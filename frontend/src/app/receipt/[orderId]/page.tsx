"use client";

import { graphql } from "@/gql/app";
import { PaymentAttemptState } from "@/gql/app/graphql";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { orderId: string } }) {
  const searchParams = useSearchParams();
  const reference = searchParams?.get("reference");

  const { data, startPolling, stopPolling } = useQuery(
    graphql(`
      query ReceiptPage_Order($data: OrderInput!, $reference: String) {
        order(data: $data) {
          order {
            id
            isFinalState
            purchasedAt
            product {
              id
              name
            }
            paymentAttempt(reference: $reference) {
              id
              state
              reference
              isFinalState
            }
            paymentStatus
            totalPrice {
              value
              unit
              valueInNok
            }
          }
        }
      }
    `),
    {
      variables: { data: { id: params.orderId }, reference: reference ?? null },
      onCompleted(data) {
        const { order } = data.order;
        if (order.isFinalState) {
          stopPolling();
        } else {
          startPolling(1_000);
        }
      },
    }
  );
  let paymentAttemptState: string = "";
  switch (data?.order.order.paymentAttempt?.state) {
    case PaymentAttemptState.Created:
      paymentAttemptState = "Betaling påbegynt";
      break;
    case PaymentAttemptState.Aborted:
      paymentAttemptState = "Betaling avbrutt";
      break;
    case PaymentAttemptState.Failed:
      paymentAttemptState = "Betaling feilet";
      break;
    case PaymentAttemptState.Expired:
      paymentAttemptState = "Betaling utløpt";
      break;
    case PaymentAttemptState.Authorized:
      paymentAttemptState = "Betaling fullført";
      break;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Card elevation={0}>
          <CardHeader title="Betaling" subheader={data?.order.order.product.name} />
          <CardContent>
            <Stack direction="column" alignItems="center">
              <Typography variant="subtitle1">{data?.order.order.product.name}</Typography>
              <Typography variant="subtitle2">Total Price: {data?.order.order.totalPrice.valueInNok}</Typography>
              <Typography variant="subtitle2">Payment Status: {data?.order.order.paymentStatus}</Typography>
              <Typography variant="subtitle2">Status: {paymentAttemptState}</Typography>
              <Typography variant="subtitle2">Purchased at: {data?.order.order.purchasedAt}</Typography>
              {!data?.order.order.paymentAttempt?.isFinalState && <CircularProgress />}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
