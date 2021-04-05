import { useMutation } from "@apollo/client";
import Layout from "@components/Layout";
import { ATTEMPT_CAPTURE_PAYMENT } from "@graphql/ecommerce/mutations";
import { CircularProgress, Container, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const FallbackPage: NextPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(ATTEMPT_CAPTURE_PAYMENT);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (orderId && paymentStatus !== "CAPTURED") {
      const interval = setInterval(() => {
        attemptCapturePayment({ variables: { orderId } });
      }, 2000);
      setCaptureInterval(interval);
    }
  }, [orderId]);

  useEffect(() => {
    if (data) {
      setPaymentStatus(data.attemptCapturePayment.status);
      if (data.attemptCapturePayment.status === "CAPTURED" && captureInterval) {
        clearInterval(captureInterval);
      }
    }
  }, [data]);

  return (
    <Layout>
      <Container>
        {paymentStatus !== "CAPTURED" || loading ? (
          <>
            <Typography variant="h1">Behandler betaling...</Typography> <CircularProgress />
          </>
        ) : (
          <>
            <Typography variant="h1">Betaling fullført!</Typography>
            <Typography variant="body1">YAYYYYYY</Typography>
          </>
        )}
        {error && <Typography>{error.message}</Typography>}
      </Container>
    </Layout>
  );
};

export default FallbackPage;
