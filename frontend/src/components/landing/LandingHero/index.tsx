import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Hero from "@public/static/landing/hero.jpg";
import Image from "next/image";
import Link from "next/link";
import OrganizationsSlider from "./OrganizationsSlider";

const LandingHero: React.FC = () => {
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
                <Grid container gap={4} direction="column" alignItems={{ xs: "center", md: "flex-start" }}>
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
                    <Button variant="contained" color="inherit" size="large">
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
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              priority
              src={Hero}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              alt=""
            />
          </Box>
        </Box>
      </Box>
      <OrganizationsSlider />
    </>
  );
};

export default LandingHero;
