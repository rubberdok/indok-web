import { Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NextLinkComposed } from "@/components/Link";

import { cabinImages } from "./ImageSlider/imageData";
import { ImageSlider } from "./ImageSlider/ImageSlider";

const RootStyle = styled("div")(({ theme }) => ({
  background: theme.vars.palette.background.elevated,
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
              Foreningens bil
            </Typography>
            <Typography variant="h2">Indøkbilen</Typography>
            <Typography sx={{ mt: 3, mb: 5, opacity: 0.72 }}>
              VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM
              VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM
              VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM
              VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM VROOM
              VROOM VROOM
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
