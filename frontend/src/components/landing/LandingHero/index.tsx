import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Hero from "@public/static/landing/hero.jpg";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "phosphor-react";
import Organizations from "./Organizations";

const LandingHero: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 4,
          height: { md: "80vh" },
          position: "relative",
        }}
      >
        <Container sx={{ alignSelf: "center", gridColumn: "1 / -1", gridRow: "1" }}>
          <Grid container direction="row">
            <Grid item md={5} xs={12}>
              <Stack spacing={4} mt={14} mb={8}>
                <Grid container gap={4} direction="column" alignItems={{ xs: "center", md: "flex-start" }}>
                  <Grid item>
                    <Typography variant="overline" sx={{ color: "primary.main" }}>
                      Foreningen for studentene ved
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h2" textAlign={{ xs: "center", md: "left" }}>
                      Industriell Økonomi & Teknologiledelse
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container direction={{ xs: "column", md: "row" }} columnGap={1} rowGap={2} alignItems="center">
                  <Grid item xs={10} md="auto">
                    <Link passHref href="/about">
                      <Button variant="contained" size="medium">
                        Les om foreningen
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item xs={10} md="auto">
                    <Link passHref href="/events">
                      <Button variant="contained" color="inherit" size="medium">
                        Se arrangementer
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: "relative",
            gridColumn: "7 / -1",
            gridRow: "1",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <Image src={Hero} layout="fill" objectFit="cover" objectPosition="center" placeholder="blur" alt="" />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100vw",
          py: { xs: 4, md: 6 },
          px: 1,
          bgcolor: "background.neutral",
          borderTop: "1px solid",
          borderColor: "divider",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Container>
          <Stack direction="row" spacing={3} minWidth="max-content" pr={3} alignItems="center">
            <Box mr={{ xs: 2, md: 6 }}>
              <Typography variant="h4">
                Våre <br />
                Foreninger
              </Typography>
            </Box>
            <Organizations />
            <Link passHref href="/about/organization">
              <Button color="inherit" size="large" endIcon={<ArrowRight />}>
                Se mer
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default LandingHero;
