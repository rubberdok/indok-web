import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Container, Grid, Stack, Typography } from "@mui/material";

import { NextLinkComposed } from "@/components/Link";
import { Title } from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { NextPageWithLayout } from "@/lib/next";

const BookingHubPage: NextPageWithLayout = () => {
  return (
    <>
      <Title
        title="Booking"
        overline="Reservasjoner"
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
        ]}
      />
      <Container sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Typography variant="h4">Velg bookingområde</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Hyttebooking
                  </Typography>
                  <Typography color="text.secondary">Gå til eksisterende bookingflyt for Oksen og Bjørnen.</Typography>
                </CardContent>
                <CardActions>
                  <Button component={NextLinkComposed} to={{ pathname: "/cabins" }} endIcon={<ArrowForward />}>
                    Gå til hyttebooking
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    JanHus booking
                  </Typography>
                  <Typography color="text.secondary">
                    Book 1. etasje, 2. etasje eller hele huset med nye regler for nivåer, provisjonell booking og
                    admin-håndtering.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={NextLinkComposed} to={{ pathname: "/janhus" }} endIcon={<ArrowForward />}>
                    Gå til JanHus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Mine bookinger
                  </Typography>
                  <Typography color="text.secondary">
                    Se egne JanHus- og hyttebookinger samlet, og betal eventuelle JanHus Vipps-forespørsler.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={NextLinkComposed}
                    to={{ pathname: "/booking/own_bookings" }}
                    endIcon={<ArrowForward />}
                  >
                    Gå til mine bookinger
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

BookingHubPage.getLayout = (page) => <Layout>{page}</Layout>;

export default BookingHubPage;
