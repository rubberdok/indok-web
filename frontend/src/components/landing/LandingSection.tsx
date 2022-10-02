import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import Hovedbygget from "@public/static/landing/hovedbygget.webp";

const LandingSection: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "grey.900",
        display: { xs: "block", md: "grid" },
        gridTemplateColumns: "repeat(2, 1fr)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          gridColumn: "1/2",
          gridRow: "1",
          height: { xs: 250, md: "auto" },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={Hovedbygget} layout="fill" objectFit="cover" objectPosition="center" placeholder="blur" alt="" />
        </Box>
      </Box>
      <Container
        sx={{ alignSelf: "center", gridColumn: "1 / -1", gridRow: "1", textAlign: { xs: "center", md: "left" } }}
      >
        <Grid container direction="row-reverse" justifyContent={{ xs: "center", md: "flex-start" }}>
          <Grid item md={6} sm={8} xs={12}>
            <Grid
              container
              my={{ xs: 6, md: 12 }}
              ml={{ xs: 0, md: 8 }}
              direction="column"
              alignItems={{ xs: "center", md: "flex-start" }}
              sx={{ color: "common.white" }}
            >
              <Grid item>
                <Typography variant="overline" sx={{ mb: 3, color: "grey.300" }}>
                  Samarbeid og kommunikasjon
                </Typography>
                <Typography variant="h2">Hovedstyret i foreningen</Typography>
                <Typography maxWidth={450} textAlign="left" sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
                  Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike
                  studentinitiativene, og forvalte og disponere Indøks midler på en forsvarlig måte.
                </Typography>

                <Link href="/about/board" passHref>
                  <Button variant="contained" size="medium">
                    Les mer
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

export default LandingSection;
