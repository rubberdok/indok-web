import { useMutation, useQuery } from "@apollo/client";
import { KeyboardArrowLeft } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/components";
import { SalesTermsDialog } from "@/components/pages/ecommerce/SalesTermsDialog";
import { AttemptCapturePaymentDocument, PaymentStatus, UserDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";
import savings from "~/public/illustrations/Savings.svg";

const FallbackPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orderId, redirect } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(AttemptCapturePaymentDocument, {
    onError: () => intervalRef.current && clearInterval(intervalRef.current),
  });
  const { data: userData } = useQuery(UserDocument);

  const paymentStatus = data?.attemptCapturePayment?.status ?? PaymentStatus.Reserved;
  const order = data?.attemptCapturePayment?.order;

  const [openSalesTerms, setOpenSalesTerms] = useState(false);
  const intervalRef: { current: NodeJS.Timer | null } = useRef(null);

  useEffect(() => {
    if (orderId && paymentStatus === PaymentStatus.Reserved) {
      intervalRef.current = setInterval(() => {
        attemptCapturePayment({ variables: { orderId: orderId as string } });
      }, 2000);
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [orderId, paymentStatus, attemptCapturePayment]);

  useEffect(() => {
    if (paymentStatus) {
      if ([PaymentStatus.Captured, PaymentStatus.Cancelled].includes(paymentStatus) && intervalRef.current) {
        // We either sucessfully captured payment or the payment was somehow cancelled
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [paymentStatus]);

  return (
    <Container>
      {redirect && typeof redirect === "string" && (
        <Box mt={2}>
          <Button startIcon={<KeyboardArrowLeft />} onClick={() => router.push(redirect)}>
            Tilbake
          </Button>
        </Box>
      )}
      <Box mb={2}>
        <Card>
          <CardHeader title="Ordrebekreftelse"></CardHeader>
          <CardContent>
            <Grid container alignItems="center" direction="column">
              {error && (
                <>
                  <Typography variant="h4">Feil</Typography>
                  <Alert severity="error" variant="filled">
                    {error.message}
                  </Alert>
                </>
              )}
              {(paymentStatus === "RESERVED" || loading) && (
                <>
                  <Grid container item direction="column" spacing={4} alignItems="center">
                    <Grid item>
                      <Typography variant="h3">Behandler... Vennligst ikke forlat siden</Typography>
                    </Grid>
                    <Grid item>
                      <CircularProgress />
                    </Grid>
                    <Grid item xs={6}>
                      <Image src={savings} alt="" />
                    </Grid>
                  </Grid>
                </>
              )}
              {paymentStatus === "CAPTURED" && order && (
                <>
                  <Typography variant="h3">Betaling fullført!</Typography>
                  <Typography variant="body1">Betalingen var vellykket og du har nå kjøpt produktet. </Typography>
                  <List
                    sx={{
                      width: "50%",
                      backgroundColor: (theme) => theme.vars.palette.background.paper,
                      textAlign: "center",
                      marginTop: "50px",
                    }}
                  >
                    <ListSubheader>
                      <Typography>Ordredetaljer</Typography>
                    </ListSubheader>
                    <ListItem sx={{ textAlign: "center" }}>
                      <ListItemText primary={order.product.name} secondary={"Produkt"} />
                    </ListItem>
                    <ListItem sx={{ textAlign: "center" }}>
                      <ListItemText primary={`${order.quantity} stk`} secondary={"Antall"} />
                    </ListItem>
                    <ListItem sx={{ textAlign: "center" }}>
                      <ListItemText primary={dayjs(order.timestamp).format("L LT")} secondary={"Dato"} />
                    </ListItem>
                    <Divider variant="middle" component="li" />
                    <ListItem sx={{ textAlign: "center" }}>
                      <ListItemText primary={`${order.totalPrice} kr`} secondary="Totalbeløp" />
                    </ListItem>
                  </List>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenSalesTerms(true);
                    }}
                  >
                    Salgsbetingelser for kjøp
                  </Button>
                  <SalesTermsDialog open={openSalesTerms} onClose={() => setOpenSalesTerms(false)} />
                </>
              )}
              {paymentStatus === "CANCELLED" && <Typography>Betalingen ble avbrutt</Typography>}
            </Grid>
          </CardContent>
          {userData?.user && (
            <CardActions>
              <Button component={Link} noLinkStyle href="/ecommerce">
                Gå til mine betalinger
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default FallbackPage;

FallbackPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);
