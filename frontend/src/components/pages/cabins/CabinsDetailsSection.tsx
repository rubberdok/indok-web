import { Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { cabinImages } from "./ImageSlider/imageData";
import ImageSlider from "./ImageSlider/ImageSlider";

const RootStyle = styled("div")(({ theme }) => ({
  background: theme.palette.background.neutral,
  position: "relative",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(10, 0),
  },
}));

const CabinsDetailsSection: React.FC = () => {
  return (
    <RootStyle>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center" spacing={{ xs: 2, md: 10 }}>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sx={{
              textAlign: { xs: "center", md: "left" },
              my: { xs: 0, md: 10 },
            }}
          >
            <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Hyttenes standard
            </Typography>
            <Typography variant="h2">Standard lik et vanlig bolighus</Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              Med sine to etasjer, rommer Bjørnen og Oksen 18 personer per hytte. Den generelle standarden er tilnærmet
              lik et vanlig bolighus.
            </Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              Begge hyttene har innlagt strøm og vann. I første etasje finner du to bad, hvorav ett med badstue, og tre
              soverom med tre til fire sengeplasser per rom. I andre etasje ligger stue, kjøkken og et fjerde soverom
              med sengeplass til tre. Dette gir totalt fjorten sengeplasser på hver hytte og ekstramadrasser til de
              resterende fire. Dyner og puter til 18 gjester ligger tilgjengelig, men laken og sengetøy må medbringes.
            </Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              Kjøkkenet er utstyrt med det mest nødvendige av hvitevarer, i tillegg til kaffetrakter, vannkoker og
              vaffeljern m.m. Basiskrydder og olje til steking skal også være tilgjengelig. På hyttene ligger det et
              bredt utvalg brettspill, samt kortstokker. I stua står det en høyttaler med AUX-kabel.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ImageSlider imageData={cabinImages} displayLabelText={false} />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default CabinsDetailsSection;
