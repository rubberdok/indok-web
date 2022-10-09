import { useQuery } from "@apollo/client";
import { KeyboardArrowLeft } from "@mui/icons-material";
import {
  Alert,
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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { OrderCellContent } from "@/components/pages/ecommerce/OrderCellContent";
import { OrderFragment, UserDocument, UserOrdersDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/pages/_app";
import { HeaderValuePair } from "@/types/utils";

const orderFields: HeaderValuePair<OrderFragment>[] = [
  { header: "Ordre-ID", field: "id" },
  { header: "Produkt", field: "product" },
  { header: "Totalpris", field: "totalPrice" },
  { header: "Antall", field: "quantity" },
  { header: "Tidspunkt", field: "timestamp" },
  { header: "Status", field: "paymentStatus" },
];

const OrdersPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const router = useRouter();

  const { loading, error, data } = useQuery(UserOrdersDocument);
  const orders = data?.userOrders;

  return (
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
                            {orders.map((order: OrderFragment) => (
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
  );
};

export default OrdersPage;

OrdersPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const { data, error } = await client.query({ query: UserDocument });

  if (error) return { notFound: true };
  if (!data.user) {
    return { notFound: true };
  }
  return addApolloState(client, { props: { user: data.user } });
};
