import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { ATTEMPT_CAPTURE_PAYMENT } from "@graphql/ecommerce/mutations";
import { Button, CircularProgress, Container, Typography } from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const FallbackPage: NextPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(ATTEMPT_CAPTURE_PAYMENT);
  const [paymentStatus, setPaymentStatus] = useState("RESERVED");
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout>();

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
      if (data.attemptCapturePayment.status !== "RESERVED" && captureInterval) {
        // We either sucessfully captured payment or the payment was somehow cancelled
        clearInterval(captureInterval);
      }
    }
  }, [data]);

  return (
    <Layout>
      <Container>
        <Button startIcon={<KeyboardArrowLeft />} onClick={() => router.back()}>
          Tilbake
        </Button>
        <Typography variant="h1">Betaling</Typography>
        {paymentStatus === "CAPTURED" ? (
          <>
            <Typography variant="h3">Betaling fullført!</Typography>
            <Typography variant="body1">Betalingen var vellykket og du har nå kjøpt produktet. </Typography>
          </>
        ) : paymentStatus === "RESERVED" || loading ? (
          <>
            <Typography variant="h3">Behandler...</Typography> <CircularProgress />
          </>
        ) : (
          <Typography>Det ser ut som at betalingen ble avbrutt</Typography>
        )}
        {error && <Typography>{error.message}</Typography>}
      </Container>
    </Layout>
  );
};

export default FallbackPage;
