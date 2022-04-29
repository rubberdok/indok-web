import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import OrderCellContent from "@components/pages/ecommerce/OrderCellContent";
import { GET_USER_ORDERS } from "@graphql/ecommerce/queries";
import { Order } from "@interfaces/ecommerce";
import { HeaderValuePair } from "@interfaces/utils";
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
} from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { redirectIfNotLoggedIn } from "src/utils/redirect";

const orderFields: HeaderValuePair<Order>[] = [
  { header: "Ordre-ID", field: "id" },
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
                    <a style={{ color: "blue" }} href="mailto:kontakt@rubberdok.no">
                      kontakt@rubberdok.no
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
                                      <OrderCellContent order={order} field={field} />
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
