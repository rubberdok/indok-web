import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import { AppBar, Box, Button, Container, Divider, Stack } from "@mui/material";
import { generateFeideLoginUrl } from "@utils/auth";
import NextLink from "next/link";
import { User } from "phosphor-react";
import { Logo } from "../../components";
import { useOffSetTop, useResponsive } from "../../hooks";
import { HEADER_DESKTOP_HEIGHT } from "../../theme/constants";
import { navigationConfig, NavigationDesktop, NavigationMobile } from "../navigation";
import { ToolbarShadowStyle, ToolbarStyle } from "./HeaderToolbarStyle";

type Props = {
  transparent?: boolean;
};

const Header: React.FC<Props> = ({ transparent }) => {
  const isDesktop = useResponsive("up", "md");
  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  const { error, loading, data } = useQuery<{ user: UserInfo | null }>(GET_USER_INFO);
  const loggedIn = !error && !loading && data?.user?.firstName !== undefined;
  const signInURL = generateFeideLoginUrl();

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
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

          {isDesktop && (
            <NavigationDesktop
              loggedIn={loggedIn}
              isScrolling={isScrolling}
              isTransparent={transparent}
              navigationConfig={navigationConfig}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Stack spacing={2} direction="row" alignItems="center">
            <Divider orientation="vertical" sx={{ height: 24 }} />

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                {loggedIn ? (
                  <NextLink href="/profile" passHref>
                    <Button endIcon={<User />} variant="contained" color="inherit">
                      Min side
                    </Button>
                  </NextLink>
                ) : (
                  <Button variant="contained" href={signInURL} target="_blank" rel="noopener">
                    Logg inn
                  </Button>
                )}
              </Stack>
            )}
          </Stack>

          {!isDesktop && (
            <NavigationMobile
              loggedIn={loggedIn}
              navigationConfig={navigationConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: "text.primary" }),
              }}
            />
          )}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}
    </AppBar>
  );
};

export default Header;
