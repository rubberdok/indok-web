"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import { NextLinkComposed } from "@/app/components/Link";
import Social from "~/public/img/gang.jpg";

export const LandingListings: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: "background.elevated",
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
        <Image
          src={Social}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          placeholder="blur"
          alt=""
          sizes={`
            (max-width: ${theme.breakpoints.values.xs}px) 100vw,
            50vw,
          `}
        />
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
              <Grid item sx={{ mr: { xs: 0, md: 2 } }}>
                <Typography
                  variant="overline"
                  sx={(theme) => ({
                    color: "primary.main",
                    [theme.getColorSchemeSelector("dark")]: {
                      color: "primary.light",
                    },
                    mb: 3,
                  })}
                >
                  Sosialt
                </Typography>
                <Typography variant="h2">Delta i et fantastisk studentmiljø</Typography>
                <Typography maxWidth={450} textAlign="left" sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
                  Vi har foreninger som tar seg av det meste, og man finner en forening for enhver som har lyst til å
                  engasjere seg!
                </Typography>

                <Button component={NextLinkComposed} to="/listings" variant="contained" size="medium">
                  Søk verv
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
