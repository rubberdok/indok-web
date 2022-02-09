import { Box, Button, Container, makeStyles, Typography } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 80,
  },
}));

const LandingListings: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container>
        <Box py={20} display="flex" alignItems="center">
          <Box maxWidth={650}>
            <Typography variant="h2">Delta i et fantastisk studentmiljø.</Typography>
            <br />
            <Typography variant="body1">
              Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
              engasjere seg!
            </Typography>
            <br />
            <Link href="./listings" passHref>
              <Button color="inherit" variant="outlined">
                Søk verv
              </Button>
            </Link>
          </Box>
          <Box ml={20} width="100%" height={350} position="relative">
            <Image layout="fill" src="/img/gang.jpg" alt="indøkstudenter" objectFit="none" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingListings;
