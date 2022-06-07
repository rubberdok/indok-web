import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { ArrowRight } from "phosphor-react";
import Organizations from "./Organizations";

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(15, 0, 8, 0),
  overflow: "hidden",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(15, 0),
    height: "80vh",
    display: "flex",
    alignItems: "center",
  },
}));

const LandingHero: React.FC = () => {
  return (
    <>
      <RootStyle>
        <Container>
          <Grid container columnSpacing={14} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6} lg={6} sx={{ textAlign: { xs: "center", md: "left", zIndex: 10 } }}>
              <Stack spacing={4} sx={{ mt: { xs: 0, md: 8 } }}>
                <Typography variant="overline" sx={{ color: "primary.main" }}>
                  Foreningen for studentene ved
                </Typography>

                <Typography variant="h1">Industriell Økonomi & Teknologiledelse</Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent={{ xs: "center", md: "unset" }}
                  spacing={2}
                >
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

            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                component="img"
                sx={{
                  objectFit: "cover",
                  height: "100vh",
                  float: "right",
                  right: 0,
                  width: 1 / 2,
                  zIndex: -1,
                  position: "absolute",
                  pl: 10,
                  top: 0,
                }}
                alt="marketing-market"
                src="/hero.jpg"
              />
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
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
