import { Box, Button, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  hero: {
    color: "white",
    height: "100vh",
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
  readMoreButton: {
    position: "absolute",
    bottom: 0,
  },
}));

const Hero: React.VFC = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.hero} alignItems="center" justifyContent="center">
      <Grid xs={12} sm={6} item container justifyContent="center">
        <Box m={2}>
          <Typography variant="h1">Hyttebooking</Typography>
        </Box>
      </Grid>
      <Grid xs={12} sm={6} item container justifyContent="center" zeroMinWidth>
        <Link href="/cabins/book" passHref>
          <Button variant="contained" endIcon={<NavigateNextIcon />}>
            Book nå
          </Button>
        </Link>
      </Grid>
      <Grid xs={12} sm={6} item container justifyContent="center">
        <Button
          className={classes.readMoreButton}
          variant="contained"
          color="primary"
          startIcon={<ExpandMoreIcon fontSize="large" />}
          onClick={() =>
            document.querySelector("#anchorBox")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Les mer om Indøkhyttene
        </Button>
      </Grid>
    </Grid>
  );
};

export default Hero;
