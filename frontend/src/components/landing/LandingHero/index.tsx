import { Box, Button, Container, Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import { Link, NextLinkComposed } from "@/components";
import Hero from "~/public/static/landing/hero.webp";

import { OrganizationsSlider } from "./OrganizationsSlider";

export const LandingHero: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 4,
          height: { md: "80vh" },
          maxHeight: "1250px",
          minHeight: "565px",
          position: "relative",
        }}
      >
        <Container sx={{ alignSelf: "center", gridColumn: "1 / -1", gridRow: "1" }}>
          <Grid container direction="row">
            <Grid container md={6} xs={12} spacing={4} mt={14} mb={8}>
              <Grid>
                <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
                  <Typography
                    variant="overline"
                    sx={(theme) => ({
                      color: "primary.main",
                      [theme.getColorSchemeSelector("dark")]: { color: "primary.light" },
                    })}
                  >
                    Foreningen for studentene ved
                  </Typography>
                  <Typography variant="h1" textAlign={{ xs: "center", md: "left" }}>
                    Industriell Økonomi & Teknologiledelse
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                container
                xs={12}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems={{ xs: "center", md: "flex-start" }}
                spacing={2}
                direction={{ xs: "column", md: "row" }}
              >
                <Grid xs={10} sm={8} md={6} lg={5}>
                  <Button fullWidth component={Link} noLinkStyle href="/about" variant="contained" size="large">
                    Les om foreningen
                  </Button>
                </Grid>
                <Grid xs={10} sm={8} md={6} lg={5}>
                  <Button
                    fullWidth
                    component={Link}
                    noLinkStyle
                    href="/events"
                    variant="contained"
                    color="contrast"
                    size="large"
                  >
                    Se arrangementer
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: "relative",
            gridColumn: "8 / -1",
            gridRow: "1",
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src={Hero}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            placeholder="blur"
            alt=""
            priority
            sizes={`
              (max-width: ${theme.breakpoints.values.sm}px) 0vw,
              40vw,
            `}
          />
        </Box>
      </Box>
      <OrganizationsSlider />
    </>
  );
};
