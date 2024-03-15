"use client";

import { useQuery, useSuspenseQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CircularProgress, Stack, Typography } from "@mui/material";

import { Currency } from "@/app/_components/Currency";
import { graphql } from "@/gql/app";
import { PaymentAttemptState } from "@/gql/app/graphql";
import dayjs from "@/lib/date";

const OrderDocument = graphql(`
  query ReceiptPage_Order($data: OrderInput!, $reference: String) {
    order(data: $data) {
      order {
        id
        isFinalState
        purchasedAt
        product {
          id
          name
          description
        }
        paymentAttempt(reference: $reference) {
          id
          state
          reference
          isFinalState
        }
        capturedPaymentAttempt {
          id
          state
          reference
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
`);

export default function Page({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { reference?: string };
}) {
  const reference = searchParams.reference;

  const { data } = useSuspenseQuery(OrderDocument, {
    variables: { data: { id: params.orderId }, reference: reference ?? null },
  });

  const { stopPolling } = useQuery(OrderDocument, {
    pollInterval: 10_000,
    variables: { data: { id: params.orderId }, reference: reference ?? null },
    onCompleted(data) {
      const { order } = data.order;
      if (order.isFinalState) {
        stopPolling();
      }
    },
  });
  let paymentAttemptState: string = "";
  switch (data.order.order.paymentAttempt?.state) {
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

  let orderPaymentStatus: string = "";
  switch (data.order.order.paymentStatus) {
    case "PENDING":
      orderPaymentStatus = "Venter på betaling";
      break;
    case "CAPTURED":
      orderPaymentStatus = "Betalt";
      break;
    case "REFUNDED":
      orderPaymentStatus = "Refundert";
      break;
    case "CANCELLED":
      orderPaymentStatus = "Avbrutt";
      break;
    case "RESERVED":
      orderPaymentStatus = "Reservert";
      break;
  }

  return (
    <Card elevation={0} sx={{ bgcolor: "background.elevated" }}>
      <CardHeader
        title={`Betalingsinformasjon for ${data.order.order.product.name}`}
        subheader={
          <Stack direction="column">
            <span>Ordrenummer {data.order.order.id}</span>
            <span>{data.order.order.product.description}</span>
          </Stack>
        }
      />
      <CardContent>
        <Stack direction="column" alignItems="flex-start">
          <Typography variant="subtitle2">Beløp</Typography>
          <Typography variant="body2">
            <Currency amount={data.order.order.totalPrice.valueInNok} />
          </Typography>
          <Typography variant="subtitle2">Ordrestatus</Typography>
          <Typography variant="body2">{orderPaymentStatus}</Typography>
          {paymentAttemptState && (
            <>
              <Typography variant="subtitle2">Status</Typography>
              <Typography variant="body2">{paymentAttemptState}</Typography>
            </>
          )}
          {data.order.order.purchasedAt && (
            <>
              <Typography variant="subtitle2">Betalingstidspunkt</Typography>
              <Typography variant="body2">{dayjs(data.order.order.purchasedAt).format("LLL")}</Typography>
            </>
          )}
          <Typography variant="subtitle2">Betalingsreferanse</Typography>
          <Typography variant="body2">{data.order.order.capturedPaymentAttempt?.reference}</Typography>
          {data.order.order.paymentAttempt?.isFinalState === false && <CircularProgress />}
        </Stack>
      </CardContent>
    </Card>
  );
}
