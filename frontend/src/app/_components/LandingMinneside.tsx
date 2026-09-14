import { Container, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NextLinkComposed } from "@/app/components/Link";

const RootStyle = styled("div")(() => ({
  position: "relative",
  display: "flex",
}));

export const LandingMinneside: React.FC = () => {
  return (
    <RootStyle>
      <Container>
        <Grid container spacing={2} justifyContent="center" alignItems="center" py={10}>
          <Button component={NextLinkComposed} to="/minneside" variant="contained" sx={{ fontSize: 20, py: 2, px: 5 }}>
            Gå til Minneside
          </Button>
        </Grid>
      </Container>
    </RootStyle>
  );
};
