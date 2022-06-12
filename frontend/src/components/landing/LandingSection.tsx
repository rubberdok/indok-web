import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Hovedbygget from "@public/static/landing/hovedbygget.jpeg";
import Image from "next/image";
import Link from "next/link";

const LandingSection: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "grey.900",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 4,
        position: "relative",
      }}
    >
      <Container
        sx={{ alignSelf: "center", gridColumn: "1 / -1", gridRow: "1", textAlign: { xs: "center", md: "left" } }}
      >
        <Grid container direction="row-reverse" justifyContent={{ xs: "center", md: "flex-start" }}>
          <Grid item md={6} sm={8} xs={12}>
            <Grid
              container
              my={{ xs: 6, md: 12 }}
              ml={{ xs: 0, md: 6 }}
              direction="column"
              alignItems={{ xs: "center", md: "flex-start" }}
              sx={{ color: "common.white" }}
            >
              <Grid item>
                <Typography variant="overline" sx={{ color: "primary.light", mb: 3 }}>
                  Samarbeid og kommunikasjon
                </Typography>
                <Typography variant="h2">Hovedstyret i Foreningen</Typography>
                <Typography textAlign="left" sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
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
      <Box
        sx={{
          position: "relative",
          gridColumn: "1 / 7",
          gridRow: "1",
          display: { xs: "none", md: "block" },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={Hovedbygget} layout="fill" objectFit="cover" objectPosition="center" placeholder="blur" alt="" />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingSection;
