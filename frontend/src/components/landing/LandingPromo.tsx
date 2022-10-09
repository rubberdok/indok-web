import { Container, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyle = styled("div")(() => ({
  position: "relative",
  display: "flex",
}));

export const LandingPromo: React.FC = () => {
  return (
    <RootStyle>
      <Container>
        <Grid container direction="row" justifyContent="center" alignItems="center" py={10}>
          <Grid item xs={12} sm={8} md={6}>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube-nocookie.com/embed/M5_q4PMJuPI"
              title="Industriell Økonomi og Teknologiledelse"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              loading="lazy"
              allowFullScreen
            />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
};
