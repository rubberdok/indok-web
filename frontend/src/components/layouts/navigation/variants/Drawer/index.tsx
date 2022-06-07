import LoginButton from "@components/layouts/components/LoginButton";
import Logo from "@components/Logo";
import { PermissionRequired } from "@components/authz";
import { Box, Divider, Drawer as MuiDrawer, Grid, IconButton, Stack, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { List } from "phosphor-react";
import { useState } from "react";
import { NavigationProps } from "../../types";
import NavigationLink from "./NavigationLink";

const Drawer: React.FC<NavigationProps> = ({ routes }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
      <IconButton onClick={() => setOpen(true)}>
        <List color={theme.palette.text.secondary} />
      </IconButton>
      <MuiDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        PaperProps={{
          sx: (theme) => ({
            width: theme.spacing(35),
          }),
        }}
      >
        <Box
          sx={(theme) => ({
            padding: theme.spacing(4),
          })}
        >
          <Stack direction="column" gap={2}>
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
            <Grid container direction="row" justifyContent="center">
              <Grid item>
                <LoginButton />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </MuiDrawer>
    </Stack>
  );
};

export default Drawer;
