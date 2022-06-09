import Layout from "@layouts/Layout";
import CabinPrices from "@components/pages/cabins/CabinPrices";
import CabinsDetailsSection from "@components/pages/cabins/CabinsDetailsSection";
import CabinsHero from "@components/pages/cabins/CabinsHero";
import CabinsInfoSection from "@components/pages/cabins/CabinsInfoSection";
import ContactCabinBoard from "@components/pages/cabins/ContactCabinBoard";
import FAQ from "@components/pages/cabins/Documents/FAQ";
import { outsideImages } from "@components/pages/cabins/ImageSlider/imageData";
import ImageSlider from "@components/pages/cabins/ImageSlider/ImageSlider";
import { Box, Container, Divider, Grid, styled, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";
import { NextPageWithLayout } from "../_app";

/*
Front page for cabins. Includes info about the cabins and link to the booking page (cabins/book).
*/

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

const CabinsPage: NextPageWithLayout = () => {
  const transportData = [
    {
      icon: <Image alt="" src="/img/undraw_bus_stop.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Kom deg til Oppdal med <Link href="https://www.atb.no/">AtB</Link>.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_off_road.svg" width={200} height={200} />,
      text: <Typography component="span">Kjøretid med bil er ca. to timer.</Typography>,
    },
    {
      icon: <Image alt="" src="/img/undraw_subway.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Ta toget med <Link href="https://www.sj.no/">SJ Nord</Link> til Oppdal for en billig penge.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_taxi.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Taxi fra togstasjonen til hyttene tar 5-10 min.{" "}
          <Link href="https://www.07373.no/Booking/?=Oppdal/">Taxi Oppdal</Link>, tlf: 72 42 12 05.
        </Typography>
      ),
    },
  ];

  return (
    <RootStyle>
      <CabinsHero />
      <CabinsInfoSection />
      <CabinsDetailsSection />
      <Container>
        <Box my={5} id="anchorBox">
          <Grid container alignItems="center" spacing={10} direction="column">
            <Grid item>
              <Grid container spacing={5} direction="column">
                <Grid item>
                  <Typography align="center" variant="h3">
                    Hvordan komme seg til Indøkhyttene
                  </Typography>
                </Grid>
                <Grid item container spacing={10} direction="row">
                  {transportData.map((transport, index) => (
                    <Grid item sm={12} md={3} key={index}>
                      <Box textAlign="center">
                        {transport.icon}
                        <Typography variant="body2">{transport.text}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item container spacing={10} alignItems="center" direction="row">
              <Grid item container justifyContent="center" alignContent="center" sm={12} md={6}>
                <Box width="90%">
                  <ImageSlider imageData={outsideImages} displayLabelText={false}></ImageSlider>
                </Box>
              </Grid>
              <Grid item sm={12} md={6}>
                <Typography variant="h3">Aktiviteter</Typography>
                <Divider component="br" />
                <Typography variant="body2">
                  <b>Sommer</b>: I løpet av sommerhalvåret kan man delta på moskusturer, sykkelturer, fjellturer,
                  rafting, golf, fallskjermhopping, jakt og fiske, rideturer, paintball og mye annet.
                </Typography>
                <Divider component="br" />
                <Typography variant="body2">
                  <b>Vinter</b>: I løpet av vinterhalvåret er det hovedsakelig alpint og langrenn som står i sentrum.
                  Det alpine skiområdet er blant de største i Norge med 14 blå, 10 grønne, 10 røde og 5 svarte løyper,
                  og normal skisesong er fra 15. november - 1. mai. Forholdene for langrenn er også gode med hele fem
                  løyper som begynner ved Stølen, alt fra 1,5 km - 15 km løyper. Se{" "}
                  <Link href="https://oppdal.com/forside/hoved/">Visit Oppdal</Link> for mer info.
                </Typography>
              </Grid>
              <Grid item container sm={12}>
                <CabinPrices />
              </Grid>
              <Grid item container spacing={10} direction="row" justifyContent="center" alignContent="center">
                <Grid item>
                  <Typography variant="h3">FAQ</Typography>
                </Grid>
                <Grid item>
                  <FAQ />
                </Grid>
              </Grid>
              <Grid item container spacing={10} direction="row" justifyContent="center" alignContent="center">
                <ContactCabinBoard />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </RootStyle>
  );
};

CabinsPage.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default CabinsPage;
