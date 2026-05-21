import { useQuery } from "@apollo/client";
import { ArrowForward } from "@mui/icons-material";
import { Alert, Button, Card, CardActions, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";

import { PermissionRequired } from "@/components/Auth";
import { NextLinkComposed } from "@/components/Link";
import { Title } from "@/components/Title";
import { JanHusAreaConfigurationsDocument, JanHusBookingSettingsDocument } from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

const JanHusPage: NextPageWithLayout = () => {
  const { data: settingsData } = useQuery(JanHusBookingSettingsDocument);
  const { data: areaData } = useQuery(JanHusAreaConfigurationsDocument);

  const settings = settingsData?.janhusBookingSettings;
  const configuredAreaCount = areaData?.janhusAreaConfigurations?.length ?? 0;

  return (
    <>
      <Title
        title="JanHus"
        overline="Booking"
        variant="dark"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "Booking",
            href: "/booking",
          },
          {
            name: "JanHus",
            href: "/janhus",
          },
        ]}
      />

      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Book JanHus</Typography>
          <Typography color="text.secondary">
            Her kan du sende bookingforespørsler for 1. etasje, 2. etasje eller hele huset.
          </Typography>

          {/* <Alert severity="info">
            Booking gjøres via eget skjema med dato og tidsintervall, mens admin håndterer godkjenning, priser og
            oppsett.
          </Alert> */}

          {/* {settings ? (
            <Alert severity="success">
              Bookingvindu: {settings.openingHour}:00–{settings.closingHour}:00, minimum varighet{" "}
              {settings.minDurationMinutes} minutter og intervaller på {settings.slotGranularityMinutes} minutter.
              {configuredAreaCount > 0 ? ` Konfigurerte områder: ${configuredAreaCount}.` : ""}
            </Alert>
          ) : null} */}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Send bookingforespørsel
                  </Typography>
                  <Typography color="text.secondary">Gå til bookingskjemaet for JanHus.</Typography>
                </CardContent>
                <CardActions>
                  <Button component={NextLinkComposed} to={{ pathname: "/janhus/book" }} endIcon={<ArrowForward />}>
                    Gå til booking
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <PermissionRequired permission="janhus.manage_booking">
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Admin
                    </Typography>
                    <Typography color="text.secondary">
                      Behandle forespørsler, bookinger og innstillinger for JanHus.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={NextLinkComposed} to={{ pathname: "/janhus/admin" }} endIcon={<ArrowForward />}>
                      Gå til admin
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </PermissionRequired>
          </Grid>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);

  await Promise.all([
    client.query({ query: JanHusBookingSettingsDocument }),
    client.query({ query: JanHusAreaConfigurationsDocument }),
  ]);

  return addApolloState(client, {
    props: {},
  });
};

JanHusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusPage;
