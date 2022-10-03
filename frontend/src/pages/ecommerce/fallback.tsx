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
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import SalesTermsDialog from "@/components/pages/ecommerce/SalesTermsDialog";
import { ATTEMPT_CAPTURE_PAYMENT } from "@/graphql/ecommerce/mutations";
import { GET_USER } from "@/graphql/users/queries";
import { Order, PaymentStatus } from "@/interfaces/ecommerce";
import { User } from "@/interfaces/users";
import Layout, { RootStyle } from "@/layouts/Layout";
import savings from "~/public/illustrations/Savings.svg";

import { NextPageWithLayout } from "../_app";

const FallbackPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orderId, redirect } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(ATTEMPT_CAPTURE_PAYMENT, {
    onError: () => intervalRef.current && clearInterval(intervalRef.current),
  });
  const { data: userData } = useQuery<{ user?: User }>(GET_USER);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("RESERVED");
  const [order, setOrder] = useState<Order>();
  const [openSalesTerms, setOpenSalesTerms] = useState(false);
  const intervalRef: { current: NodeJS.Timer | null } = useRef(null);

  useEffect(() => {
    if (orderId && paymentStatus == "RESERVED") {
      intervalRef.current = setInterval(() => {
        attemptCapturePayment({ variables: { orderId } });
      }, 2000);
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [orderId]);

  useEffect(() => {
    if (data) {
      setPaymentStatus(data.attemptCapturePayment.status);
      setOrder(data.attemptCapturePayment.order);
      if (["CAPTURED", "CANCELLED"].includes(data.attemptCapturePayment.status) && intervalRef.current) {
        // We either sucessfully captured payment or the payment was somehow cancelled
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [data]);

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
              {error ? (
                <>
                  <Typography variant="h4">Feil</Typography>
                  <Alert severity="error" variant="filled">
                    {error.message}
                  </Alert>
                </>
              ) : paymentStatus === "RESERVED" || loading ? (
                <>
                  <Grid container item direction="column" spacing={4} alignItems="center">
                    <Grid item>
                      <Typography variant="h3">Behandler... Vennligst ikke forlat siden</Typography>
                    </Grid>
                    <Grid item>
                      <CircularProgress />
                    </Grid>
                    <Grid item xs={6}>
                      <Image src={savings} />
                    </Grid>
                  </Grid>
                </>
              ) : paymentStatus === "CAPTURED" && order ? (
                <>
                  <Typography variant="h3">Betaling fullført!</Typography>
                  <Typography variant="body1">Betalingen var vellykket og du har nå kjøpt produktet. </Typography>
                  <List
                    sx={{
                      width: "50%",
                      backgroundColor: (theme) => theme.palette.background.paper,
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
                      <ListItemText
                        primary={dayjs(order.timestamp).format("DD. MMM YYYY, kl. HH:mm")}
                        secondary={"Dato"}
                      />
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
              ) : paymentStatus === "CANCELLED" ? (
                <Typography>Betalingen ble avbrutt</Typography>
              ) : (
                <Typography>Noe gikk galt</Typography>
              )}
            </Grid>
          </CardContent>
          {userData?.user && (
            <CardActions>
              <Link href="/ecommerce" passHref>
                <Button>Gå til mine betalinger</Button>
              </Link>
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
