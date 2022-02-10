import PermissionRequired from "@components/permissions/PermissionRequired";
import { Box, Button, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Link from "next/link";

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

interface Props {
  isLoggedIn: boolean;
}

const Hero: React.VFC<Props> = ({ isLoggedIn }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.hero} alignItems="center" justifyContent="center">
      <Grid xs={12} sm={6} item container justifyContent="center">
        <Box m={2}>
          <Typography variant="h1">Hyttebooking</Typography>
        </Box>
      </Grid>
      <Grid xs={12} sm={6} item container justifyContent="center" zeroMinWidth>
        <PermissionRequired
          permission="cabins.change_booking"
          fallback={
            !isLoggedIn ? (
              // User is not logged in, and therefore does not have the permission.
              <Typography variant="h5">Du må være logget inn for å booke en hytte.</Typography>
            ) : (
              // User is logged in, but does not have the permission (we disabled cabin booking for a subset of the users)
              <Typography variant="h5">Her blir det snart mulig å reservere indøkhyttene</Typography>
            )
          }
        >
          <Link href="/cabins/book" passHref>
            <Button variant="contained" endIcon={<NavigateNextIcon />}>
              Book nå
            </Button>
          </Link>
        </PermissionRequired>
      </Grid>
      <Grid xs={12} sm={6} item container justifyContent="center">
        <Button
          className={classes.readMoreButton}
          variant="contained"
          color="primary"
          startIcon={<ExpandMoreIcon fontSize="large" />}
          onClick={() => document.querySelector("#anchorBox")?.scrollIntoView({ behavior: "smooth" })}
        >
          Les mer om Indøkhyttene
        </Button>
      </Grid>
    </Grid>
  );
};

export default Hero;
