"use client";

import { useMutation, useSuspenseQuery } from "@apollo/client";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { graphql } from "@/gql/app";
import { OrderPaymentStatus } from "@/gql/app/graphql";
import { config } from "@/utils/config";

import { Currency } from "@/app/_components/Currency";
import { Link } from "@/app/components/Link";
import { useState } from "react";
import { VippsCheckoutButton } from "./VippsCheckoutButton";

export default function Page({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const router = useRouter();
  const [salesTermsAccepted, setSalesTermsAccepted] = useState(false);

  const { data } = useSuspenseQuery(
    graphql(`
      query order($data: OrderInput!) {
        order(data: $data) {
          order {
            id
            product {
              id
              name
              description
            }
            paymentStatus
            isFinalState
            totalPrice {
              valueInNok
            }
          }
        }
      }
    `),
    { variables: { data: { id: orderId } } }
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
          orderId,
          returnUrl: new URL(`/receipt/${orderId}`, config.FRONTEND_URI).toString(),
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
    router.push(`/receipt/${orderId}`);
  }

  return (
    <>
      <Container maxWidth="sm" disableGutters>
        <Card>
          <CardHeader title="Bekreft bestilling" />
          <CardContent>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle1">Produkt</Typography>
              <Typography>{product.name}</Typography>
              <Typography variant="subtitle2">Beskrivelse</Typography>
              <Typography>{product.description}</Typography>
              <Typography variant="subtitle1">Totalpris</Typography>
              <Typography>
                <Currency amount={order.totalPrice.valueInNok} />
              </Typography>
              <FormControlLabel
                required
                control={<Checkbox />}
                checked={salesTermsAccepted}
                onChange={(_e, checked) => setSalesTermsAccepted(checked)}
                label={
                  <Typography variant="inherit">
                    Jeg har lest og forstått <Link href={`/checkout/${orderId}/terms-of-sale`}>salgsbetingelsene</Link>
                  </Typography>
                }
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Stack spacing={2} direction="row" justifyContent="center" width={1}>
              <VippsCheckoutButton onClick={initiatePaymentAttempt} branded disabled={!salesTermsAccepted} />
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
