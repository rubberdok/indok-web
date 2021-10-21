import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { ATTEMPT_CAPTURE_PAYMENT } from "@graphql/ecommerce/mutations";
import { Order, PaymentStatus } from "@interfaces/ecommerce";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  something: {},
}));

const FallbackPage: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { orderId } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(ATTEMPT_CAPTURE_PAYMENT);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("RESERVED");
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout>();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    if (orderId && paymentStatus == "RESERVED") {
      const interval = setInterval(() => {
        attemptCapturePayment({ variables: { orderId } });
      }, 2000);
      setCaptureInterval(interval);
    }
  }, [orderId]);

  useEffect(() => {
    if (data) {
      setPaymentStatus(data.attemptCapturePayment.status);
      setOrder(data.attemptCapturePayment.order);
      if (["CAPTURED", "CANCELLED"].includes(data.attemptCapturePayment.status) && captureInterval) {
        // We either sucessfully captured payment or the payment was somehow cancelled
        clearInterval(captureInterval);
      }
    }
  }, [data]);

  return (
    <Layout>
      <Container>
        <Box mt={2}>
          <Button startIcon={<KeyboardArrowLeft />} onClick={() => router.back()}>
            Tilbake
          </Button>
        </Box>
        <Box mb={2}>
          <Card>
            <CardHeader title="Betaling"></CardHeader>
            <CardContent>
              <Grid container alignItems="center" direction="column">
                {paymentStatus === "RESERVED" || loading ? (
                  <>
                    <Typography variant="h3">Behandler...</Typography> <CircularProgress />
                  </>
                ) : paymentStatus === "CAPTURED" && order ? (
                  <>
                    <Typography variant="h3">Betaling fullført!</Typography>
                    <Typography variant="body1">Betalingen var vellykket og du har nå kjøpt produktet. </Typography>
                    <Typography>Produkt: {order.product.name}</Typography>
                    <Typography>Antall: {order.quantity}</Typography>
                    <Typography>Totalbeløp: {order.totalPrice}</Typography>
                    <Typography>Dato: {order.date}</Typography>
                  </>
                ) : paymentStatus === "CANCELLED" ? (
                  <Typography>Betalingen ble avbrutt</Typography>
                ) : (
                  <Typography>Noe gikk galt</Typography>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {error && <Typography>{error.message}</Typography>}
      </Container>
    </Layout>
  );
};

export default FallbackPage;
