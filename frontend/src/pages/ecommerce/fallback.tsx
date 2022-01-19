import { useMutation } from "@apollo/client";
import SalesTermsDialog from "@components/ecommerce/SalesTermsDialog";
import Layout from "@components/Layout";
import { ATTEMPT_CAPTURE_PAYMENT } from "@graphql/ecommerce/mutations";
import { Order, PaymentStatus } from "@interfaces/ecommerce";
import {
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
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
    marginTop: "50px",
  },
  listitem: {
    textAlign: "center",
  },
}));

const FallbackPage: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { orderId } = router.query;

  const [attemptCapturePayment, { data, loading, error }] = useMutation(ATTEMPT_CAPTURE_PAYMENT, {
    onError: () => intervalRef.current && clearInterval(intervalRef.current),
  });
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

  if (redirectIfNotLoggedIn()) {
    return null;
  }

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
                {error ? (
                  <>
                    <Typography variant="h4">Feil</Typography>
                    <Alert severity="error" variant="filled">
                      {error.message}
                    </Alert>
                  </>
                ) : paymentStatus === "RESERVED" || loading ? (
                  <>
                    <Typography variant="h3">Behandler...</Typography> <CircularProgress />
                  </>
                ) : paymentStatus === "CAPTURED" && order ? (
                  <>
                    <Typography variant="h3">Betaling fullført!</Typography>
                    <Typography variant="body1">Betalingen var vellykket og du har nå kjøpt produktet. </Typography>
                    <List className={classes.list}>
                      <ListSubheader>
                        <Typography>Ordredetaljer</Typography>
                      </ListSubheader>
                      <ListItem className={classes.listitem}>
                        <ListItemText primary={order.product.name} secondary={"Produkt"} />
                      </ListItem>
                      <ListItem className={classes.listitem}>
                        <ListItemText primary={`${order.quantity} stk`} secondary={"Antall"} />
                      </ListItem>
                      <ListItem className={classes.listitem}>
                        <ListItemText
                          primary={dayjs(order.timestamp).format("DD. MMM YYYY, kl. HH:mm")}
                          secondary={"Dato"}
                        />
                      </ListItem>
                      <Divider variant="middle" component="li" />
                      <ListItem className={classes.listitem}>
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
            <CardActions>
              <Link href="/ecommerce">
                <Button>Gå til mine betalinger</Button>
              </Link>
            </CardActions>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default FallbackPage;
