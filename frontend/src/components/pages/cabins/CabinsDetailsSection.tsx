import { Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
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
        <Grid container justifyContent="space-between" direction="row-reverse" alignItems="center" spacing={8}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              textAlign: "left",
              my: { xs: 0, md: 10 },
            }}
          >
            <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Foreningens hytter
            </Typography>
            <Typography variant="h2">Indøkhyttene - Oksen og Bjørnen</Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              De to identiske nabohyttene ligger idyllisk til, kun et steinkast unna Stølen alpinsenter i Oppdal.
              Hyttene har flere bruksområder; alt fra strategiske samlinger og egne arrangementer til sosiale, spontane
              venneturer. Det er en gyllen mulighet til å få en liten pause fra det travle bylivet. Indøks egne
              Hytteturstyre arrangerer flere forskjellige turer i løpet av året. Dette er en flott mulighet til både å
              bli kjent med hyttene, området rundt hyttene, og å bli kjent med andre indøkere på tvers av
              klassetrinnene. Hytteforeningen har det daglige ansvaret for drift og vedlikehold av Indøkhyttene og
              organisering av utleie.
            </Typography>
            <Grid item>
              <Link href="/about/organizations/hyttestyret" passHref>
                <Button variant="outlined" size="small" fullWidth={false}>
                  Om Hytteforeningen
                </Button>
              </Link>
            </Grid>
            {/* <Typography variant="overline" sx={{ color: "primary.main", mb: 2, display: "block" }}>
              Hyttenes standard
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Med sine to etasjer, rommer Bjørnen og Oksen 18 personer per hytte. Den generelle standarden er tilnærmet
              lik et vanlig bolighus.
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Begge hyttene har innlagt strøm og vann. I første etasje finner du to bad, hvorav ett med badstue, og tre
              soverom med tre til fire sengeplasser per rom. I andre etasje ligger stue, kjøkken og et fjerde soverom
              med sengeplass til tre. Dette gir totalt fjorten sengeplasser på hver hytte og ekstramadrasser til de
              resterende fire. Dyner og puter til 18 gjester ligger tilgjengelig, men laken og sengetøy må medbringes.
            </Typography>
            <Typography gutterBottom sx={{ opacity: 0.72 }}>
              Kjøkkenet er utstyrt med det mest nødvendige av hvitevarer, i tillegg til kaffetrakter, vannkoker og
              vaffeljern m.m. Basiskrydder og olje til steking skal også være tilgjengelig. På hyttene ligger det et
              bredt utvalg brettspill, samt kortstokker. I stua står det en høyttaler med AUX-kabel.
          </Typography>*/}
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageSlider imageData={cabinImages} displayLabelText={false} />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default CabinsDetailsSection;
