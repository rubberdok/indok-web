import { AppBar, Box, Container, useScrollTrigger } from "@mui/material";
import React from "react";
import { Logo } from "../../../components";
import Navigation from "../../navigation";
import { ToolbarStyle } from "../styles";

type Props = {
  transparent?: boolean;
};

const Basic: React.FC<Props> = ({ transparent }) => {
  const scrolling = useScrollTrigger({ disableHysteresis: true, threshold: 30 });

  return (
    <AppBar sx={{ bgcolor: "transparent", boxShadow: 0 }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={scrolling}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box sx={{ position: "relative", mr: 2 }}>
            <Logo />
          </Box>

          <Navigation />
        </Container>
      </ToolbarStyle>
    </AppBar>
  );
};

export default Basic;
