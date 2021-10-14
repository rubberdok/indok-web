import { Typography, Box, Grid, Paper, Divider, Container } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ImageSlider from "@components/pages/cabins/ImageSlider/ImageSlider";
import { cabinImages, outsideImages } from "@components/pages/cabins/ImageSlider/imageData";
import FAQ from "@components/pages/cabins/Documents/FAQ";
import Layout from "@components/Layout";
import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import Image from "next/image";
import ContactCabinBoard from "@components/pages/cabins/ContactCabinBoard";
import Hero from "@components/pages/cabins/Hero";

/*
Front page for cabins. Includes info about the cabins and link to the booking page (cabins/book).
*/
const CabinsPage: NextPage = () => {
  const { data, error } = useQuery<{ user: User }>(GET_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (data && data.user && !error) {
      setIsLoggedIn(true);
    }
  }, [data]);

  const facilitiesData = [
    {
      icon: <Image alt="" src="/img/undraw_home.svg" width={100} height={100} />,
      text: "Varmekabler",
    },
    {
      icon: <Image alt="" src="/img/undraw_electricity.svg" width={100} height={100} />,
      text: "Innlagt strøm",
    },
    {
      icon: <Image alt="" src="/img/undraw_speaker.svg" width={100} height={100} />,
      text: "Høyttaleranlegg",
    },
    {
      icon: <Image alt="" src="/img/undraw_bed.svg" width={100} height={100} />,
      text: "18 soveplasser",
    },
    {
      icon: <Image alt="" src="/img/undraw_cooking.svg" width={100} height={100} />,
      text: "Kjøkken",
    },
    {
      icon: <Image alt="" src="/img/undraw_cabin.svg" width={100} height={100} />,
      text: "Badstue",
    },
  ];

  const transportData = [
    {
      icon: <Image alt="" src="/img/undraw_bus_stop.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Kom deg til Oppdal med <Link href="https://www.atb.no/buss-regioner/">AtB Region</Link> eller{" "}
          <Link href="https://www.lavprisekspressen.no/">Lavprisekspressen</Link>.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_off_road.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          <Link href="https://www.sixt.no/">Sixt</Link>: pris ca. 1200,- for en helg, ekskl. bensin. Kjøretiden er ca.
          to timer.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_subway.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Ta toget med <Link href="https://www.vy.no/">VY</Link> til Oppdal for en billig penge.
        </Typography>
      ),
    },
    {
      icon: <Image alt="" src="/img/undraw_taxi.svg" width={200} height={200} />,
      text: (
        <Typography component="span">
          Taxi fra togstasjonen til hyttene tar 5-10 min.{" "}
          <Link href="https://www.visitnorway.no/listings/oppdal-taxi/203941/">Taxi Oppdal</Link>, tlf: 72 42 12 05.
        </Typography>
      ),
    },
  ];

  return (
    <Layout>
      <Hero isLoggedIn={isLoggedIn} />
      <Container>
        <Box my={5} id="anchorBox">
          <Paper>
            <Box p={5}>
              <Grid container alignItems="center" spacing={10} direction="column">
                <Grid item>
                  <Grid container alignItems="center" spacing={10}>
                    <Grid xs={12} sm={6} item>
                      <Box textAlign="center">
                        <Typography variant="h3">Fasiliteter</Typography>
                      </Box>
                      <Divider />
                      <Box m={3}>
                        <Grid container spacing={4} justifyContent="center">
                          {facilitiesData.map((facility) => (
                            <Grid item md={4} sm={6} xs={6} key={facility.text}>
                              <Box textAlign="center">
                                {facility.icon}
                                <Typography variant={"body2"}>{facility.text}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid xs={12} sm={6} item>
                      <Typography variant="h3">Indøkhyttene - Oksen og Bjørnen</Typography>
                      <Divider component="br" />
                      <Typography variant="body2">
                        De to identiske nabohyttene ligger idyllisk til, kun et steinkast unna Stølen alpinsenter i
                        Oppdal. Hyttene har flere bruksområder; alt fra strategiske samlinger og egne arrangementer til
                        sosiale, spontane venneturer. Det er en gyllen mulighet til å få en liten pause fra det travle
                        bylivet. Indøks egne hyttestyre arrangerer flere forskjellige turer i løpet av året. Dette er en
                        flott mulighet til både å bli kjent med hyttene, området rundt hyttene, og å bli kjent med andre
                        indøkere på tvers av klassetrinnene. Hyttestyret har det daglige ansvaret for drift og utbedring
                        av Indøkhyttene, organisering av utleie og felles hytteturer. Du kan lese mer om hyttestyret
                        <Link href="/about/organizations/hyttestyret"> her.</Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={10} direction="row">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h3">Hyttenes standard</Typography>
                      <Divider component="br" />
                      <Typography variant="body2">
                        Med sine to etasjer, er Bjørnen og Oksen estimert til å romme 18 personer per hytte. Den
                        generelle standarden er tilnærmet lik et vanlig bolighus. Hyttene har innlagt strøm og vann samt
                        at de også har WiFi. I første etasje finner du to bad, hvorav ett med badstue, og tre soverom
                        med tre til fire sengeplasser per rom. I andre etasje ligger stue, kjøkken og et fjerde soverom
                        med sengeplass til tre. Dette gir totalt fjorten sengeplasser på hver hytte og ekstramadrasser
                        til de resterende seks det er estimert med. Dyner og puter til alle tjue ligger tilgjengelig,
                        men laken og sengetøy må medbringes. Kjøkkenet er utstyrt med det mest nødvendige av hvitevarer,
                        i tillegg til kaffetrakter, vannkoker og vaffeljern m.m. Basiskrydder og olje til steking skal
                        også være tilgjengelig. På hyttene ligger det et bredt utvalg brettspill, samt kortstokker. I
                        stua står det anlegg med AUX-kabel.
                      </Typography>
                    </Grid>

                    <Grid item container xs={12} sm={6} justifyContent="center" alignContent="center">
                      <Box width="90%">
                        <ImageSlider imageData={cabinImages} displayLabelText={false} />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
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
                      <b>Vinter</b>: I løpet av vinterhalvåret er det hovedsakelig alpint og langrenn som står i
                      sentrum. Det alpine skiområdet er blant de største i Norge med 14 blå, 10 grønne, 10 røde og 5
                      svarte løyper, og normal skisesong er fra 15. november – 1. mai. Forholdene for langrenn er også
                      gode med hele fem løyper som begynner ved Stølen, alt fra 1,5 km – 15 km løyper. Se Oppdal Booking
                      for mer info.
                    </Typography>
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
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default CabinsPage;
