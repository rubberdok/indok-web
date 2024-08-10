"use client";

import { Box, Button, Container, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import Image from "next/image";

import { OrganizationsSlider } from "./OrganizationsSlider";

import { Link } from "@/app/components/Link";
import Hero from "~/public/static/landing/hero.webp";

export const LandingHero: React.FC = () => {
  return (
    <>
      <Box
        display="grid"
        position="relative"
        columnGap={4}
        gridTemplateColumns="repeat(12, 1fr)"
        minHeight="32rem"
        height="70vh"
        maxHeight={{ md: "1250px", xs: "900px" }}
      >
        <Container
          sx={{
            gridColumn: "1 / -1",
            gridRow: "1",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
          }}
        >
          <Box gridColumn={{ md: "1 / 8", xs: "1 / -1" }} display="flex" justifyContent="center">
            <Grid
              container
              direction="column"
              position="relative"
              justifyContent="center"
              alignItems={{ xs: "center", md: "flex-start" }}
              spacing={2}
            >
              <Grid>
                <Typography
                  variant="overline"
                  sx={(t) => ({
                    color: "primary.main",
                    [t.getColorSchemeSelector("dark")]: { color: "primary.light" },
                  })}
                >
                  Janus linjeforening
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="h1" textAlign={{ xs: "center", md: "left" }}>
                  Industriell Økonomi & Teknologiledelse
                </Typography>
              </Grid>
              <Grid
                container
                xs={12}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems={{ xs: "center", md: "flex-start" }}
                direction={{ xs: "column", md: "row" }}
              >
                <Grid xs={10} sm={8} md={5} lg={5}>
                  <Button fullWidth component={Link} noLinkStyle href="/about" variant="contained" size="large">
                    Les om foreningen
                  </Button>
                </Grid>
                <Grid xs={10} sm={8} md={5} lg={5}>
                  <Button
                    fullWidth
                    component={Link}
                    noLinkStyle
                    href="/events"
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Se arrangementer
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box display={{ xs: "none", md: "block" }} gridColumn="8 / -1" gridRow="1" position="relative">
          <Image
            src={Hero}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            placeholder="blur"
            alt=""
            priority
            sizes={`
              40vw,
            `}
          />
        </Box>
      </Box>
      <OrganizationsSlider />
    </>
  );
};
