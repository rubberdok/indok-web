import { Box, Button, Container, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import { Link } from "@/components";
import Hero from "~/public/static/landing/hero.webp";

import { OrganizationsSlider } from "./OrganizationsSlider";

export const LandingHero: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        display="grid"
        position="relative"
        columnGap={4}
        gridTemplateColumns="repeat(12, 1fr)"
        height={{ md: "80vh" }}
        maxHeight={{ md: "1250px", xs: "900px" }}
        minHeight="565px"
      >
        <Container
          sx={{
            gridColumn: "1 / -1",
            gridRow: "1",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
          }}
        >
          <Box gridColumn={{ md: "1 / 8", xs: "1 / -1" }} mt={14} mb={8} display="flex" justifyContent="center">
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
                  Foreningen for studentene ved
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
              ${theme.breakpoints.down("sm")} 0vw,
              40vw,
            `}
          />
        </Box>
      </Box>
      <OrganizationsSlider />
    </>
  );
};
