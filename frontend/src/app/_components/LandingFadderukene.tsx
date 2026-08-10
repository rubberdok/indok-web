"use client";

import { Container, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NextLinkComposed } from "@/app/components/Link";

const RootStyle = styled("div")(() => ({
  position: "relative",
  display: "flex",
}));

export const LandingFadderukene: React.FC = () => {
  const monthInOslo = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    timeZone: "Europe/Oslo",
  }).format(new Date());

  if (monthInOslo !== "8") {
    // kun synlig i august.
    return null;
  }

  return (
    <RootStyle>
      <Container>
        <Grid container direction="row" justifyContent="center" alignItems="center" py={10}>
          <Button
            component={NextLinkComposed}
            to="/fadderukene"
            variant="contained"
            sx={{ fontSize: 20, py: 2, px: 5 }}
          >
            Les om Fadderukene
          </Button>
        </Grid>
      </Container>
    </RootStyle>
  );
};
