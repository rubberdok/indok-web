import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/future/image";
import Link from "next/link";

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
            <Grid item md={5} xs={12}>
              <Stack spacing={4} mt={14} mb={8}>
                <Grid container gap={2} direction="column" alignItems={{ xs: "center", md: "flex-start" }}>
                  <Grid item>
                    <Typography
                      variant="overline"
                      sx={{ color: (theme) => (theme.palette.mode === "light" ? "primary.main" : "primary.light") }}
                    >
                      Foreningen for studentene ved
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h1" textAlign={{ xs: "center", md: "left" }}>
                      Industriell Økonomi & Teknologiledelse
                    </Typography>
                  </Grid>
                </Grid>

                <Stack spacing={{ xs: 1.5, md: 2 }} direction={{ xs: "column", md: "row" }}>
                  <Link passHref href="/about">
                    <Button variant="contained" size="large">
                      Les om foreningen
                    </Button>
                  </Link>
                  <Link passHref href="/events">
                    <Button variant="contained" color="contrast" size="large">
                      Se arrangementer
                    </Button>
                  </Link>
                </Stack>
              </Stack>
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
