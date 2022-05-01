import { AppBar, Box, Container, Divider, Stack, useScrollTrigger } from "@mui/material";
import React from "react";
import { Logo } from "../../../components";
import { HEADER_DESKTOP_HEIGHT } from "../../../theme/constants";
import LoginButton from "../../components/LoginButton";
import { navigationConfig, NavigationDesktop, NavigationMobile } from "../../navigation";
import { ToolbarStyle } from "../styles";

type Props = {
  transparent?: boolean;
};

const ElevationScroll: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const Header: React.FC<Props> = ({ transparent }) => {
  const scrolling = useScrollTrigger({ threshold: HEADER_DESKTOP_HEIGHT });
  return (
    <ElevationScroll>
      <AppBar sx={{ bgcolor: "transparent" }}>
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

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <NavigationDesktop
                isScrolling={scrolling}
                isTransparent={transparent}
                navigationConfig={navigationConfig}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Stack spacing={2} direction="row" alignItems="center">
              <Divider orientation="vertical" sx={{ height: 24 }} />

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Stack direction="row" spacing={1}>
                  <LoginButton />
                </Stack>
              </Box>
            </Stack>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <NavigationMobile
                navigationConfig={navigationConfig}
                sx={{
                  ml: 1,
                }}
              />
            </Box>
          </Container>
        </ToolbarStyle>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
