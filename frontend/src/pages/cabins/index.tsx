import Navbar from "@components/navbar/Navbar";
import { Typography, makeStyles, Box, Grid, Button, Paper, Divider } from "@material-ui/core";
import { NextPage } from "next";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import WifiIcon from "@material-ui/icons/Wifi";
import FireplaceIcon from "@material-ui/icons/Fireplace";
import PowerIcon from "@material-ui/icons/Power";
import SpeakerIcon from "@material-ui/icons/Speaker";
import HotelIcon from "@material-ui/icons/Hotel";
import RestaurantIcon from "@material-ui/icons/Restaurant";

const useStyles = makeStyles(() => ({
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
}));

const CreateBookingPage: NextPage = () => {
  const classes = useStyles();
  const facilitiesData = [
    {
      icon: <WifiIcon fontSize="large" />,
      text: "Trådløst internett",
    },
    {
      icon: <FireplaceIcon fontSize="large" />,
      text: "Varmekabler",
    },
    {
      icon: <PowerIcon fontSize="large" />,
      text: "Innlagt strøm",
    },
    {
      icon: <SpeakerIcon fontSize="large" />,
      text: "Høyttaleranlegg",
    },
    {
      icon: <HotelIcon fontSize="large" />,
      text: "20 soveplasser",
    },
    {
      icon: <RestaurantIcon fontSize="large" />,
      text: "Kjøkken",
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
          <Button variant="contained" endIcon={<NavigateNextIcon />}>
            Book nå
          </Button>
        </Grid>
      </Grid>
      <Box m={5}>
        <Paper>
          <Box p={5}>
            <Grid container alignItems="center" spacing={10}>
              <Grid xs={12} sm={6} item>
                <Box textAlign="center">
                  <Typography variant="h3">Fasiliteter</Typography>
                </Box>
                <Divider />
                <Box m={3}>
                  <Grid container spacing={10} justify="center">
                    {facilitiesData.map((facility) => (
                      <Grid item xs={4} key={facility.text}>
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
                <br />
                <Typography variant="body2">
                  De to identiske nabohyttene ligger idyllisk til, kun et steinkast unna Stølen alpinsenter i Oppdal.
                  Hyttene har flere bruksområder; alt fra strategiske samlinger og egne arrangementer til sosiale,
                  spontane venneturer. Det er en gyllen mulighet til å få en liten pause fra det travle bylivet. Indøks
                  egne hyttestyre arrangerer flere forskjellige turer i løpet av året. Dette er en flott mulighet til
                  både å bli kjent med hyttene, området rundt hyttene, og å bli kjent med andre indøkere på tvers av
                  klassetrinnene. Hyttestyret har det daglige ansvaret for drift og utbedring av Indøkhyttene,
                  organisering av utleie og felles hytteturer.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default CreateBookingPage;
