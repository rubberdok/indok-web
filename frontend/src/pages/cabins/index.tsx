import Navbar from "@components/navbar/Navbar";
import { Typography, makeStyles, Box, Grid, Button, Paper, Divider, Theme } from "@material-ui/core";
import { NextPage } from "next";
import Link from "next/link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import WifiIcon from "@material-ui/icons/Wifi";
import FireplaceIcon from "@material-ui/icons/Fireplace";
import PowerIcon from "@material-ui/icons/Power";
import SpeakerIcon from "@material-ui/icons/Speaker";
import HotelIcon from "@material-ui/icons/Hotel";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import { DirectionsBus, DirectionsCar, DirectionsTransit, LocalTaxi } from "@material-ui/icons";
import React from "react";
import ImageSlider from "@components/pages/cabins/ImageSlider/ImageSlider";

const useStyles = makeStyles((theme: Theme) => ({
  hero: {
    color: "white",
    height: "calc(100vh - 130px)",
    width: "100%",
    backgroundColor: "black",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8)), url('img/hytte.jpg')`,
  },
  icon: {
    fontSize: "70px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "30px",
    },
  },
}));

const CreateBookingPage: NextPage = () => {
  const classes = useStyles();

  const facilitiesData = [
    {
      icon: <WifiIcon className={classes.icon} />,
      text: "Trådløst internett",
    },
    {
      icon: <FireplaceIcon className={classes.icon} />,
      text: "Varmekabler",
    },
    {
      icon: <PowerIcon className={classes.icon} />,
      text: "Innlagt strøm",
    },
    {
      icon: <SpeakerIcon className={classes.icon} />,
      text: "Høyttaleranlegg",
    },
    {
      icon: <HotelIcon className={classes.icon} />,
      text: "20 soveplasser",
    },
    {
      icon: <RestaurantIcon className={classes.icon} />,
      text: "Kjøkken",
    },
  ];

  const transportData = [
    {
      icon: <DirectionsBus fontSize="large" style={{ fontSize: "80px" }} />,
      text: "Kom deg til Oppdal med NOR-WAY Bussekspress eller Lavprisekspressen",
    },
    {
      icon: <DirectionsCar fontSize="large" style={{ fontSize: "80px" }} />,
      text: "Sixt: pris ca. 1200,- for en helg, ekskl. bensin. Kjøretiden er ca. to timer.",
    },
    {
      icon: <DirectionsTransit fontSize="large" style={{ fontSize: "80px" }} />,
      text: "Ta toget med NSB til Oppdal for en billig penge.",
    },
    {
      icon: <LocalTaxi fontSize="large" style={{ fontSize: "80px" }} />,
      text: "Taxi fra togstasjonen til hyttene tar 5-10 min. Taxi Oppdal, tlf: 72 42 12 05",
    },
  ];
  return (
    <>
      <Navbar />
      <Grid container className={classes.hero} alignItems="center" justify="center">
        <Grid xs={12} sm={6} item container justify="center">
          <Box>
            <Typography variant="h1">Hyttebooking</Typography>
            <Typography variant="overline">Reservasjon av indøkhyttene</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} item container justify="center">
          <Link href="/cabins/book" passHref>
            <Button variant="contained" endIcon={<NavigateNextIcon />}>
              Book nå
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Box m={5}>
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
                      <Grid container spacing={10} justify="center">
                        {facilitiesData.map((facility) => (
                          <Grid item md={4} sm={6} xs={12} key={facility.text}>
                            <Box textAlign="center">
                              {facility.icon}
                              <Typography>{facility.text}</Typography>
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
                      av Indøkhyttene, organisering av utleie og felles hytteturer.
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
                      Med sine to etasjer, er Bjørnen og Oksen estimert til å romme 20 personer per hytte. Den generelle
                      standarden er tilnærmet lik et vanlig bolighus. Hyttene har innlagt strøm og vann samt at de også
                      har WiFi. I første etasje finner du to bad, hvorav ett med badstue, og tre soverom med tre til
                      fire sengeplasser per rom. I andre etasje ligger stue, kjøkken og et fjerde soverom med sengeplass
                      til tre. Dette gir totalt fjorten sengeplasser på hver hytte og ekstramadrasser til de resterende
                      seks det er estimert med. Dyner og puter til alle tjue ligger tilgjengelig, men laken og sengetøy
                      må medbringes. Kjøkkenet er utstyrt med det mest nødvendige av hvitevarer, i tillegg til
                      kaffetrakter, vannkoker og vaffeljern m.m. Basiskrydder og olje til steking skal også være
                      tilgjengelig. På hyttene ligger det et bredt utvalg brettspill, samt kortstokker. I stua står det
                      anlegg med AUX-kabel.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} justify="center" alignContent="center">
                    <Grid container justify="center" alignContent="center">
                      <Box width="65%">
                        <ImageSlider cabins={["Bjørnen", "Oksen"]} />
                      </Box>
                    </Grid>
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
                  <Grid item>
                    <Grid container spacing={10} direction="row">
                      {transportData.map((transport) => (
                        <Grid item sm={12} md={3} key={transport.text}>
                          <Box textAlign="center">
                            {transport.icon}
                            <Typography variant="body2">{transport.text}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={10} alignItems="center" direction="row">
                  <Grid item sm={12} md={6}>
                    <Box>
                      <img alt="aktiviteter" src="img/aktiviteter.jpg" />
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
                      gode med hele fem løyper som begynner ved Stølen, alt fra 15 km – 1,5 km løyper. Se Oppdal Booking
                      for mer info.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default CreateBookingPage;
