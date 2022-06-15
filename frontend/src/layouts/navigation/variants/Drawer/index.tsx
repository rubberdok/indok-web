import { PermissionRequired } from "@components/Auth";
import Logo from "@components/Logo";
import LoginButton from "@layouts/components/LoginButton";
import { Box, Divider, Drawer as MuiDrawer, IconButton, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { List } from "phosphor-react";
import { useState } from "react";
import { NavigationProps } from "../../types";
import NavigationLink from "./NavigationLink";

const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "text.secondary" }}>
        <List alt="Meny" />
      </IconButton>
      <MuiDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
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
                    <NavigationLink route={route} active={pathname.includes(route.path)} />
                  </PermissionRequired>
                );
              }
              return <NavigationLink key={route.title} route={route} active={pathname.includes(route.path)} />;
            })}
            <Divider />

            <LoginButton fullWidth />
          </Stack>
        </Box>
      </MuiDrawer>
    </Stack>
  );
};

export default Drawer;
