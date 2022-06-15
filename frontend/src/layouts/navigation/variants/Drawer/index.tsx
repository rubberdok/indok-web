import { PermissionRequired } from "@components/Auth";
import Logo from "@components/Logo";
import LoginButton from "@layouts/components/LoginButton";
import { Box, Divider, Drawer as MuiDrawer, IconButton, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { MenuIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { NavigationProps } from "../../types";
import NavigationLink from "./NavigationLink";

const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "text.secondary" }} aria-label="Meny">
        <MenuIcon width={24} height={24} />
      </IconButton>
      <MuiDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: (thm) => thm.spacing(35),
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
                    <NavigationLink route={route} active={pathname.includes(route.path)} />
                  </PermissionRequired>
                );
              }
              return <NavigationLink key={route.title} route={route} active={pathname.includes(route.path)} />;
            })}
            <Divider />

            <LoginButton />
          </Stack>
        </Box>
      </MuiDrawer>
    </Stack>
  );
};

export default Drawer;
