import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Hero from "@public/static/landing/hero.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Organizations from "./Organizations";

const LandingHero: React.FC = () => {
  const orgsTitleEl = useRef<HTMLElement>();

  const [sliderActiveIndex, setSliderActiveIndex] = useState(0);
  const [sliderOffsetX, setSliderOffsetX] = useState(0);

  const onActiveIndexChange = (index: number) => {
    setSliderActiveIndex(index);
  };

  const updateSliderOffset = () => {
    if (orgsTitleEl.current) {
      setSliderOffsetX(orgsTitleEl.current.offsetWidth + orgsTitleEl.current.offsetLeft);
    }
  };

  useEffect(() => {
    updateSliderOffset();
    window.addEventListener("resize", updateSliderOffset);
    return () => {
      window.removeEventListener("resize", updateSliderOffset);
    };
  }, []);

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
          borderBottom: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Container>
          <Stack direction="row" minWidth="max-content" alignItems="center">
            <Box ref={orgsTitleEl}>
              <Typography
                variant="h4"
                sx={{
                  opacity: sliderActiveIndex == 0 ? 1 : 0,
                  transition: (theme) => theme.transitions.create("opacity"),
                }}
              >
                Våre <br />
                Foreninger
              </Typography>
            </Box>
            <Organizations onActiveIndexChange={onActiveIndexChange} offsetX={sliderOffsetX + 48} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default LandingHero;
