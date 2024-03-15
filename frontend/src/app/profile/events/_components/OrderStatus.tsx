"use client";
import { Cancel, CheckCircle, Pending } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

import { NextLinkComposed } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { OrderPaymentStatus } from "@/gql/app/graphql";

type OrderStatusProps = {
  signUp: FragmentType<typeof OrderStatusFragment>;
};
const OrderStatusFragment = graphql(`
  fragment OrderStatus_SignUp on SignUp {
    order {
      id
      paymentStatus
      totalPrice {
        valueInNok
      }
    }
  }
`);
export function OrderStatus(props: OrderStatusProps) {
  const { order } = getFragmentData(OrderStatusFragment, props.signUp);

  if (!order) return null;

  const { paymentStatus } = order;
  const humanReadableStatus = toHumanReadableStatus(paymentStatus);
  switch (paymentStatus) {
    case OrderPaymentStatus.Captured: {
      return (
        <Stack direction="row" spacing={2}>
          <CheckCircle color="success" />
          <Typography variant="body1">{humanReadableStatus}</Typography>
        </Stack>
      );
    }
    case OrderPaymentStatus.Pending:
    case OrderPaymentStatus.Created:
      return (
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Cancel color="warning" />
            <Typography variant="body1">{humanReadableStatus}</Typography>
          </Stack>
          <Button component={NextLinkComposed} to={`/checkout/${order.id}`} variant="outlined">
            Betal nå
          </Button>
        </Stack>
      );
    case OrderPaymentStatus.Reserved:
      return (
        <Stack direction="column">
          <Stack direction="row" spacing={2}>
            <Pending color="action" />
            <Typography variant="body1">{humanReadableStatus}</Typography>
          </Stack>
          <Typography variant="caption">
            Beløpet er reservert, og vi vil bekrefte betalingen så fort som mulig.
          </Typography>
        </Stack>
      );
    case OrderPaymentStatus.Cancelled: {
      return (
        <Stack direction="column">
          <Stack direction="row" spacing={2}>
            <Cancel color="error" />
            <Typography variant="body1">{humanReadableStatus}</Typography>
            <Typography variant="caption"></Typography>
          </Stack>
          <Typography variant="caption">
            Betalingen er avbrutt, dette kan skyldes at du har blitt meldt av arrangementet.
          </Typography>
        </Stack>
      );
    }
    case OrderPaymentStatus.Refunded: {
      return (
        <Stack direction="column">
          <Stack direction="row" spacing={2}>
            <CheckCircle color="success" />
            <Typography variant="body1">{humanReadableStatus}</Typography>
          </Stack>
          <Typography variant="caption">
            Betalingen er refundert, og vil være tilgjengelig på kontoen din snart, som oftest innen 2-3 virkedager.
          </Typography>
        </Stack>
      );
    }
  }
}
function toHumanReadableStatus(status: OrderPaymentStatus) {
  switch (status) {
    case OrderPaymentStatus.Captured:
      return "Betalt";
    case OrderPaymentStatus.Cancelled:
      return "Avbrutt";
    case OrderPaymentStatus.Created:
    case OrderPaymentStatus.Pending:
      return "Ikke betalt";
    case OrderPaymentStatus.Reserved:
      return "Beløp reservert";
    case OrderPaymentStatus.Refunded:
      return "Refundert";
  }
}
