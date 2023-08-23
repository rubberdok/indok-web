"use client";

import { Box, Container, useScrollTrigger } from "@mui/material";
import { PropsFor } from "@mui/system";
import React from "react";

import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

import { Logo } from "../Logo";

import { Navigation } from "./navigation";
import { AppBar as StyledAppBar } from "./styles";

type ScrollProps = {
  children: React.ReactElement;
};

const ElevationScroll: React.FC<React.PropsWithChildren<ScrollProps>> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 30,
  });

  return React.cloneElement<PropsFor<typeof StyledAppBar>>(children, {
    elevation: trigger ? 2 : 0,
    scrolling: trigger,
  });
};

export const AppBar: React.FC = () => {
  return (
    <>
      <ElevationScroll>
        <StyledAppBar>
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
        </StyledAppBar>
      </ElevationScroll>
      <Box
        sx={(theme) => ({
          height: HEADER_MOBILE_HEIGHT,
          [theme.breakpoints.up("md")]: {
            height: HEADER_DESKTOP_HEIGHT,
          },
        })}
      />
    </>
  );
};
