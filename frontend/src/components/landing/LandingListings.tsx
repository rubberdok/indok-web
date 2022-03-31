import { Box, Button, Container, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 80,
  },
  container: {
    alignItems: "center",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));

const LandingListings: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  return (
    <Box className={classes.root}>
      <Container>
        <Box py={isMobile ? 10 : 20} display="flex" className={classes.container}>
          <Box maxWidth={650}>
            <Typography variant="h2">Delta i et fantastisk studentmiljø.</Typography>
            <br />
            <Typography variant="body1">
              Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
              engasjere seg!
            </Typography>
            <br />
            <Link href="/listings" passHref>
              <Button color="inherit" variant="outlined">
                Søk verv
              </Button>
            </Link>
          </Box>
          <Box ml={isMobile ? 0 : 20} mt={isMobile ? 10 : 0} width="100%" height={350} position="relative">
            <Image layout="fill" src="/img/gang.jpg" alt="indøkstudenter" objectFit={isMobile ? "cover" : "none"} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingListings;
