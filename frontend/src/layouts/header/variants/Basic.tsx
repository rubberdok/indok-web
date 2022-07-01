import { AppBarProps, Box, Container, useScrollTrigger } from "@mui/material";
import React from "react";
import { Logo } from "../../../components";
import Navigation from "../../navigation";
import { AppBar } from "../styles";

type Props = {
  transparent?: boolean;
};

const Basic: React.FC<Props & AppBarProps> = ({ transparent, ...props }) => {
  const scrolling = useScrollTrigger({ disableHysteresis: true, threshold: 30 });

  return (
    <AppBar scrolling={scrolling} transparent={transparent} {...props}>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <Box sx={{ position: "relative", mr: 6 }}>
          <Logo />
        </Box>

        <Navigation />
      </Container>
    </AppBar>
  );
};

export default Basic;
