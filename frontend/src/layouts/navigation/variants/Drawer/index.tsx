import { PermissionRequired } from "@components/Auth";
import Logo from "@components/Logo";
import LoginButton from "@layouts/components/LoginButton";
import { Menu } from "@mui/icons-material";
import { Box, Divider, Drawer as MuiDrawer, IconButton, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { NavigationProps } from "../../types";
import NavigationLink from "./NavigationLink";

const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  const closeDrawer = () => setOpen(false);
  return (
    <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
        <IconButton onClick={() => setOpen(true)} sx={{ color: "text.secondary" }}>
          <Menu aria-label="menu" />
        </IconButton>
        <MuiDrawer
          open={open}
          onClose={() => setOpen(false)}
          anchor="right"
          keepMounted
          PaperProps={{
            sx: {
              width: (theme) => theme.spacing(35),
            },
          }}
        >
          <Box px={3} pt={2}>
            <Stack direction="column" spacing={2}>
              <Logo />
              {routes.map((route) => {
                if (route.permission) {
                  return (
                    <PermissionRequired permission={route.permission} key={route.title}>
                      <NavigationLink route={route} active={pathname.includes(route.path)} onClick={closeDrawer} />
                    </PermissionRequired>
                  );
                }
                return (
                  <NavigationLink
                    key={route.title}
                    route={route}
                    active={pathname.includes(route.path)}
                    onClick={closeDrawer}
                  />
                );
              })}
              <Divider />

              <LoginButton fullWidth data-test-id="drawer-login" />
            </Stack>
          </Box>
        </MuiDrawer>
      </Stack>
    </Box>
  );
};

export default Drawer;
