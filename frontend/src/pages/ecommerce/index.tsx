import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { GET_USER_ORDERS } from "@graphql/ecommerce/queries";
import { Order } from "@interfaces/ecommerce";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

type HeaderValuePair<T> = {
  header: string;
  field: keyof T;
};

const orderFields: HeaderValuePair<Order>[] = [
  { header: "Ordre ID", field: "id" },
  { header: "Produkt", field: "product" },
  { header: "Totalpris", field: "totalPrice" },
  { header: "Antall", field: "quantity" },
  { header: "Tidspunkt", field: "timestamp" },
  { header: "Status", field: "paymentStatus" },
];

const OrdersPage: NextPage = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>();

  const { loading, error } = useQuery<{ userOrders: Order[] }>(GET_USER_ORDERS, {
    onCompleted: (data) => setOrders(data.userOrders),
  });

  if (redirectIfNotLoggedIn()) {
    return null;
  }

  const CellContent = ({ order, field }: { order: Order; field: HeaderValuePair<Order> }) => {
    let content: string;
    switch (field.header) {
      case "Produkt":
        content = order.product.name;
        break;
      case "Totalpris":
        content = `${order.totalPrice} kr`;
        break;
      case "Tidspunkt":
        content = dayjs(order.timestamp).format("DD/MM/YYYY, HH:mm");
        break;
      case "Status":
        content =
          order.paymentStatus == "CAPTURED"
            ? "Fullført"
            : order.paymentStatus == "RESERVED"
            ? "Betalt"
            : order.paymentStatus == "INITIATED"
            ? "Påbegynt"
            : ["FAILED", "CANCELLED", "REJECTED"].includes(order.paymentStatus)
            ? "Avbrutt"
            : order.paymentStatus;
        break;
      default:
        content = `${order[field.field]}`;
    }
    return <Typography variant={field.header == "Ordre ID" ? "caption" : "body2"}>{content}</Typography>;
  };

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
            <CardHeader title="Betalinger"></CardHeader>
            <CardContent>
              <Grid container alignItems="center" direction="column" spacing={3}>
                <Grid item xs={12}>
                  <Alert variant="filled" severity="info">
                    Betalingsløsningen er under utvikling. Dersom du opplever problemer, kontakt{" "}
                    <a style={{ color: "blue" }} href="mailto:feedback@rubberdok.no">
                      feedback@rubberdok.no
                    </a>
                  </Alert>
                </Grid>
                {error ? (
                  <>
                    <Typography variant="h3">Feil</Typography>
                    <Alert severity="error" variant="filled">
                      {error.message}
                    </Alert>
                  </>
                ) : loading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h3">Mine betalinger</Typography>
                      {orders && orders.length !== 0 ? (
                        <TableContainer style={{ maxHeight: 600 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {orderFields.map((field) => (
                                  <TableCell key={`user-header-${field.header}`}>{field.header}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orders.map((order: Order) => (
                                <TableRow key={`user-row-${order.id}`}>
                                  {orderFields.map((field) => (
                                    <TableCell key={`user-${order.id}-cell--${field.field}`}>
                                      <CellContent order={order} field={field} />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography align="center" variant="body1">
                          Ingen ordrer funnet
                        </Typography>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default OrdersPage;
