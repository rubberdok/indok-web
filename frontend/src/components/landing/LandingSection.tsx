import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyle = styled("div")(({ theme }) => ({
  background: theme.palette.grey[900],
  position: "relative",
  display: "flex",
}));

const LandingSection: React.FC = () => {
  return (
    <RootStyle>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              component="img"
              sx={{ height: 1, position: "absolute", top: 0, left: 0, width: 1 / 2, objectFit: "cover" }}
              alt="recruitment"
              src="/hovedbygget.jpeg"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              color: "common.white",
              textAlign: { xs: "center", md: "left" },
              my: 10,
            }}
          >
            <Typography variant="overline" sx={{ color: "primary.light", mb: 2, display: "block" }}>
              Samarbeid og kommunikasjon
            </Typography>
            <Typography variant="h2">Hovedstyret i Foreningen</Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              Hovedstyrets fremste oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike
              studentinitiativene, og forvalte og disponere Indøks midler på en forsvarlig måte.
            </Typography>

            <Button variant="contained" size="large">
              Les mer
            </Button>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default LandingSection;
