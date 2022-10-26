import { AppBarProps, Box, Container, useScrollTrigger } from "@mui/material";
import { PropsFor } from "@mui/system";
import React from "react";

import { Logo } from "../../../components";
import { Navigation } from "../../navigation";
import { AppBar } from "../styles";

type Props = {
  transparent?: boolean;
};

type ScrollProps = {
  children: React.ReactElement;
};

const ElevationScroll: React.FC<React.PropsWithChildren<ScrollProps>> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 30,
  });

  return React.cloneElement<PropsFor<typeof AppBar>>(children, {
    elevation: trigger ? 2 : 0,
    scrolling: trigger,
  });
};

export const Basic: React.FC<React.PropsWithChildren<Props & AppBarProps>> = ({ transparent, ...props }) => {
  return (
    <ElevationScroll>
      <AppBar transparent={transparent} {...props}>
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
    </ElevationScroll>
  );
};
