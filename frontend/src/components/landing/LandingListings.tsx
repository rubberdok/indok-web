import { Box, Button, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import React from "react";

const LandingListings: React.FC = () => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <Box pt={{ xs: 3, md: 10 }}>
      <Container>
        <Stack py={isMobile ? 6 : 20} display="flex" alignItems="center" direction={{ xs: "column", md: "row" }}>
          <Box maxWidth={650}>
            <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Sosialt
            </Typography>
            <Typography variant="h2">Delta i et fantastisk studentmiljø.</Typography>
            <br />
            <Typography variant="body1">
              Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
              engasjere seg!
            </Typography>
            <br />
            <Link href="/listings" passHref>
              <Button color="primary" variant="contained" size="large">
                Søk verv
              </Button>
            </Link>
          </Box>
          <Box ml={isMobile ? 0 : 20} mt={isMobile ? 10 : 0} width="100%" height={350} position="relative">
            <Box
              component="img"
              src="/img/gang.jpg"
              alt="indøkstudenter"
              sx={{ objectFit: isMobile ? "cover" : "contain", width: 1 }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingListings;
