import useResponsive from "@hooks/useResponsive";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Social from "@public/img/gang.jpg";

const LandingListings: React.FC = () => {
  const isMobile = useResponsive({ query: "down", key: "md" });

  return (
    <Container sx={{ my: 12 }}>
      <Box
        sx={{
          display: "grid",
          gap: (theme) => theme.spacing(8),
          ...(!isMobile ? { gridTemplateColumns: "repeat(2, 1fr)" } : { gridTemplateRows: "repeat(2, 1fr)" }),
        }}
      >
        <Box>
          <Grid container justifyContent={{ xs: "center", md: "flex-start" }}>
            <Grid item sm={8} xs={12}>
              <Typography
                variant="overline"
                sx={{
                  color: (theme) => (theme.palette.mode === "light" ? "primary.main" : "primary.light"),
                  mb: 2,
                  display: "block",
                }}
              >
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
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Image src={Social} layout="fill" objectFit="cover" objectPosition="center" placeholder="blur" alt="" />
        </Box>
      </Box>
    </Container>
  );
};

export default LandingListings;
