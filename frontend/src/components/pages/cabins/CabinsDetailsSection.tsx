import { Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NextLinkComposed } from "@/components/Link";

import { cabinImages } from "./ImageSlider/imageData";
import { ImageSlider } from "./ImageSlider/ImageSlider";

const RootStyle = styled("div")(({ theme }) => ({
  background: theme.palette.background.elevated,
  position: "relative",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(10, 0),
  },
}));

export const CabinsDetailsSection: React.FC = () => {
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
              <Button
                component={NextLinkComposed}
                to="/about/organizations/hytteforeningen"
                variant="outlined"
                size="small"
                fullWidth={false}
              >
                Om Hytteforeningen
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageSlider imageData={cabinImages} displayLabelText={false} />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};
