import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";

import { Link } from "@/components";
import { CarsDetailsSection } from "@/components/pages/cars/CarsDetailsSection";
import { CarsHero } from "@/components/pages/cars/CarsHero";
import { CarsInfoSection } from "@/components/pages/cars/CarsInfoSection";
import { ContactCarBoard } from "@/components/pages/cars/ContactCarBoard";
import { FAQ } from "@/components/pages/cars/FAQ";
import { outsideImages } from "@/components/pages/cars/ImageSlider/imageData";
import { ImageSlider } from "@/components/pages/cars/ImageSlider/ImageSlider";
import { CarsAndResponsiblesDocument } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";

/** Front page for cars. Includes info about the cars and link to the booking page (cars/book). */
const CarsPage: NextPageWithLayout = () => {
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
      <Head>
        <title>Hyttebooking | Indøk NTNU - Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse</title>
        <meta name="og:image" content="/img/hytte.jpg" />
      </Head>
      <CarsHero />
      <CarsInfoSection />
      <CarsDetailsSection />
      <Container sx={{ my: 8 }}>
        <Grid
          container
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={4}
          mb={8}
        >
          <Grid item>
            <Typography variant="h3">FAQ</Typography>
          </Grid>
          <Grid item>
            <FAQ />
          </Grid>
        </Grid>
        <ContactCarBoard />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = initializeApollo({}, ctx);
  const { data } = await client.query({ query: CarsAndResponsiblesDocument });

  return addApolloState(client, {
    props: {
      ...data,
    },
  });
};

export default CarsPage;
