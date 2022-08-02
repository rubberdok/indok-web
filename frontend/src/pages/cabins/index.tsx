import CabinsDetailsSection from "@components/pages/cabins/CabinsDetailsSection";
import CabinsHero from "@components/pages/cabins/CabinsHero";
import CabinsInfoSection from "@components/pages/cabins/CabinsInfoSection";
import ContactCabinBoard from "@components/pages/cabins/ContactCabinBoard";
import FAQ from "@components/pages/cabins/Documents/FAQ";
import { outsideImages } from "@components/pages/cabins/ImageSlider/imageData";
import ImageSlider from "@components/pages/cabins/ImageSlider/ImageSlider";
import Layout from "@layouts/Layout";
import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { NextPageWithLayout } from "../_app";

/*
Front page for cabins. Includes info about the cabins and link to the booking page (cabins/book).
*/
const CabinsPage: NextPageWithLayout = () => {
  const transportData = [
    {
      icon: <Image alt="" src="/img/undraw_bus_stop.svg" width={200} height={200} />,
      text: (
        <Typography component="span" variant="caption">
          Kom deg til Oppdal med <Link href="https://www.atb.no/">AtB</Link>.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_off_road.svg" width={200} height={200} />,
      text: (
        <Typography component="span" variant="caption">
          Kjøretid med bil er ca. to timer.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_subway.svg" width={200} height={200} />,
      text: (
        <Typography component="span" variant="caption">
          Ta toget med <Link href="https://www.sj.no/">SJ Nord</Link> til Oppdal for en billig penge.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_taxi.svg" width={200} height={200} />,
      text: (
        <Typography component="span" variant="caption">
          Taxi fra togstasjonen til hyttene tar 5-10 min.{" "}
          <Link href="https://www.07373.no/Booking/?=Oppdal/">Taxi Oppdal</Link>, tlf: 72 42 12 05.
        </Typography>
      ),
    },
  ];

  return (
    <>
      <CabinsHero />
      <CabinsInfoSection />
      <CabinsDetailsSection />
      <Container sx={{ my: 8 }}>
        <Grid
          container
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={4}
          mb={8}
        >
          <Grid item sm={6}>
            <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Hyttenes standard
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Med sine to etasjer, rommer Bjørnen og Oksen 18 personer per hytte. Den generelle standarden er tilnærmet
              lik et vanlig bolighus.
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Begge hyttene har innlagt strøm og vann. I første etasje finner du to bad, hvorav ett med badstue, og tre
              soverom med tre til fire sengeplasser per rom. I andre etasje ligger stue, kjøkken og et fjerde soverom
              med sengeplass til tre. Dette gir totalt fjorten sengeplasser på hver hytte og ekstramadrasser til de
              resterende fire. Dyner og puter til 18 gjester ligger tilgjengelig, men laken og sengetøy må medbringes.
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Kjøkkenet er utstyrt med det mest nødvendige av hvitevarer, i tillegg til kaffetrakter, vannkoker og
              vaffeljern m.m. Basiskrydder og olje til steking skal også være tilgjengelig. På hyttene ligger det et
              bredt utvalg brettspill, samt kortstokker. I stua står det en høyttaler med AUX-kabel.
            </Typography>
          </Grid>
          <Grid sm={6} container item direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Typography align="center" variant="h3">
                Transport
              </Typography>
            </Grid>
            <Grid container item direction="row">
              {transportData.map((transport, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Stack textAlign="center" direction="column" justifyContent="center" alignItems="center" spacing={1}>
                    {transport.icon}
                    {transport.text}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row-reverse"
          justifyContent="space-between"
          alignItems="stretch"
          columnSpacing={{ sm: 8, xs: 0 }}
          rowSpacing={{ sm: 0, xs: 8 }}
          mb={8}
        >
          <Grid item xs={12} sm={6}>
            <Typography variant="h3">Aktiviteter</Typography>
            <Divider component="br" />
            <Typography variant="body2">
              <b>Sommer</b>: I løpet av sommerhalvåret kan man delta på moskusturer, sykkelturer, fjellturer, rafting,
              golf, fallskjermhopping, jakt og fiske, rideturer, paintball og mye annet.
            </Typography>
            <Divider component="br" />
            <Typography variant="body2">
              <b>Vinter</b>: I løpet av vinterhalvåret er det hovedsakelig alpint og langrenn som står i sentrum. Det
              alpine skiområdet er blant de største i Norge med 14 blå, 10 grønne, 10 røde og 5 svarte løyper, og normal
              skisesong er fra 15. november - 1. mai. Forholdene for langrenn er også gode med hele fem løyper som
              begynner ved Stølen, alt fra 1,5 km - 15 km løyper. Se{" "}
              <Link href="https://oppdal.com/forside/hoved/">Visit Oppdal</Link> for mer info.
            </Typography>
          </Grid>
          <Grid container item xs={12} sm={6}>
            <Box width="100%">
              <ImageSlider imageData={outsideImages} displayLabelText={false}></ImageSlider>
            </Box>
          </Grid>
        </Grid>
        <Grid item container spacing={10} direction="row" justifyContent="center" alignContent="center" mb={8}>
          <Grid item>
            <Typography variant="h3">FAQ</Typography>
          </Grid>
          <Grid item>
            <FAQ />
          </Grid>
        </Grid>
        <ContactCabinBoard />
      </Container>
    </>
  );
};

CabinsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CabinsPage;
