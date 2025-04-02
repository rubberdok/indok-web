import { Menu } from "@mui/icons-material";
import { Box, Divider, IconButton, Drawer as MuiDrawer, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import { PermissionRequired } from "@/components/Auth";
import { Logo } from "@/components/Logo";
import { ColorModeSwitcher } from "@/layouts/components/ColorModeSwitcher";
import { LoginButton } from "@/layouts/components/LoginButton";

import { NavigationProps } from "../../types";

import { NavigationLink } from "./NavigationLink";

export const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
        <IconButton onClick={() => setOpen(true)} sx={{ color: "text.secondary" }} aria-label="meny">
          <Menu />
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
              <Stack direction="row" justifyContent="space-between">
                <Logo />
                <ColorModeSwitcher />
              </Stack>
              {routes.map((route) => {
                if (route.permission) {
                  return (
                    <PermissionRequired permission={route.permission} key={route.title}>
                      <NavigationLink route={route} active={pathname.includes(route.path)} />
                    </PermissionRequired>
                  );
                }
                return <NavigationLink key={route.title} route={route} active={pathname.includes(route.path)} />;
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
