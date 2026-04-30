import { ArrowForward } from "@mui/icons-material";
import { Alert, Button, Card, CardActions, CardContent, Container, Grid, Stack, Typography } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";
import { Title } from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const JanHusPage: NextPageWithLayout = () => {
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

          <Alert severity="info">
            Booking gjøres via eget skjema med dato og tidsintervall, mens admin håndterer godkjenning, priser og
            oppsett.
          </Alert>

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
          </Grid>
        </Stack>
      </Container>
    </>
  );
};

JanHusPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusPage;
