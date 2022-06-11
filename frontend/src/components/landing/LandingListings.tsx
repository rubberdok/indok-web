import useResponsive from "@hooks/useResponsive";
import { getBlurUrl } from "@lib/cloudinary";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Social from "@public/img/gang.jpg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LandingListings: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.neutral",
        display: { xs: "block", md: "grid" },
        gridTemplateColumns: "repeat(2, 1fr)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          gridColumn: "2 / 2",
          gridRow: "1",
          height: { xs: 250, md: "auto" },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={Social}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            placeholder="blur"
            blurDataURL={getBlurUrl(Social)}
            alt=""
          />
        </Box>
      </Box>
      <Container
        sx={{
          alignSelf: "center",
          gridColumn: "1 / -1",
          gridRow: "1",
          textAlign: { xs: "center", md: "left" },
          flexGrow: 1,
        }}
      >
        <Grid container direction="row" justifyContent={{ xs: "center", md: "flex-start" }}>
          <Grid item md={6} sm={8} xs={12}>
            <Grid container my={{ xs: 6, md: 12 }} direction="column" alignItems={{ xs: "center", md: "flex-start" }}>
              <Grid item>
                <Typography
                  variant="overline"
                  sx={{
                    color: (theme) => (theme.palette.mode === "light" ? "primary.main" : "primary.light"),
                    mb: 3,
                  }}
                >
                  Sosialt
                </Typography>
                <Typography variant="h2">Delta i et fantastisk studentmiljø</Typography>
                <Typography maxWidth={450} textAlign="left" sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
                  Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
                  engasjere seg!
                </Typography>

                <Link href="/listings" passHref>
                  <Button variant="contained" size="medium">
                    Søk verv
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingListings;
