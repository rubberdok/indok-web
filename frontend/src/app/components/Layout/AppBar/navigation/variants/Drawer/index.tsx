"use client";

import { Menu } from "@mui/icons-material";
import { Box, Divider, IconButton, Drawer as MuiDrawer, Stack } from "@mui/material";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";

import { LoginButton } from "@/app/components/LoginButton";
import { PermissionRequired } from "@/app/components/PermissionRequired";
import { ColorModeSwitcher } from "@/layouts/components/ColorModeSwitcher";

import { NavigationProps } from "../props";

import { NavigationLink } from "./NavigationLink";
import { Logo } from "@/app/components/Layout/Logo";

export const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const segment = useSelectedLayoutSegment();

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
                      <NavigationLink route={route} active={route.segment === segment} />
                    </PermissionRequired>
                  );
                }
                return <NavigationLink key={route.title} route={route} active={route.segment === segment} />;
              })}
              <Divider />
              <LoginButton />
            </Stack>
          </Box>
        </MuiDrawer>
      </Stack>
    </Box>
  );
};
