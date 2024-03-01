"use client";

import { Link } from "@/app/components/Link";
import { graphql } from "@/gql/app";
import { OrderPaymentStatus } from "@/gql/app/graphql";
import { useSuspenseQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import dayjs from "dayjs";

export default function Page() {
  const { data } = useSuspenseQuery(
    graphql(`
      query ProfileOrdersPage {
        orders {
          orders {
            id
            createdAt
            capturedPaymentAttempt {
              id
              reference
              state
            }
            product {
              id
              name
            }
            totalPrice {
              valueInNok
            }
            purchasedAt
            paymentStatus
            isFinalState
          }
        }
      }
    `)
  );
  const { orders } = data.orders;

  return (
    <Container maxWidth="sm">
      <Typography variant="subtitle1" component="h1" gutterBottom>
        Ordrehistorikk
      </Typography>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Card>
            <CardHeader
              title={order.product.name}
              subheader={
                <Stack>
                  <div>Ordrenummer: {order.id}</div>
                  {order.capturedPaymentAttempt && (
                    <div>
                      Betalingsreferanse:{" "}
                      <Link href={`/receipt/${order.id}?reference=${order.capturedPaymentAttempt.reference}`}>
                        {order.capturedPaymentAttempt.reference}
                      </Link>
                    </div>
                  )}
                </Stack>
              }
            />
            <CardContent>
              <Grid container direction="row">
                <Grid>
                  <Typography>Totalpris:</Typography>
                </Grid>
                <Grid xs>
                  <Typography textAlign="right">{order.totalPrice.valueInNok} kr</Typography>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid>
                  <Typography>Bestillingstidspunkt:</Typography>
                </Grid>
                <Grid xs>
                  <Typography textAlign="right">{dayjs(order.createdAt).format("LLL")}</Typography>
                </Grid>
              </Grid>
              {order.purchasedAt && (
                <Grid container direction="row">
                  <Grid>
                    <Typography>Betalingstidspunkt:</Typography>
                  </Grid>
                  <Grid xs>
                    <Typography textAlign="right">{dayjs(order.purchasedAt).format("LLL")} kr</Typography>
                  </Grid>
                </Grid>
              )}
              <Grid container direction="row">
                <Grid>
                  <Typography>Status:</Typography>
                </Grid>
                <Grid xs>
                  <Typography textAlign="right">{getStatus(order.paymentStatus)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

function getStatus(status: OrderPaymentStatus) {
  switch (status) {
    case OrderPaymentStatus.Captured:
      return "Betalt";
    case OrderPaymentStatus.Created:
    case OrderPaymentStatus.Pending:
      return "Ikke betalt";
    case OrderPaymentStatus.Cancelled:
      return "Avbrutt";
    case OrderPaymentStatus.Refunded:
      return "Refundert";
    case OrderPaymentStatus.Reserved:
      return "Reservert";
  }
}
