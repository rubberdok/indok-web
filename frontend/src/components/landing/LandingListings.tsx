import useResponsive from "@hooks/useResponsive";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LandingListings: React.FC = () => {
  const isMobile = useResponsive({ query: "down", key: "md" });

  return (
    <Container sx={{ my: (theme) => theme.spacing(8) }}>
      <Box
        sx={{
          display: "grid",
          gap: (theme) => theme.spacing(8),
          ...(!isMobile ? { gridTemplateColumns: "repeat(2, 1fr)" } : { gridTemplateRows: "repeat(2, 1fr)" }),
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
            Sosialt
          </Typography>
          <Typography variant="h2">Delta i et fantastisk studentmiljø</Typography>
          <br />
          <Typography variant="body1">
            Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
            engasjere seg!
          </Typography>
          <br />
          <Link href="/listings" passHref>
            <Button color="primary" variant="contained" size="medium">
              Søk verv
            </Button>
          </Link>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Image src="/img/gang.jpg" layout="fill" objectFit="cover" objectPosition="center" />
        </Box>
      </Box>
    </Container>
  );
};

export default LandingListings;
