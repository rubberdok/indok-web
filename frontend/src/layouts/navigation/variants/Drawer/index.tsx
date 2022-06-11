import { PermissionRequired } from "@components/Auth";
import Logo from "@components/Logo";
import LoginButton from "@layouts/components/LoginButton";
import { Box, Divider, Drawer as MuiDrawer, Grid, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
        <List color={theme.palette.text.secondary} alt="Meny" />
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
        <Box
          sx={{
            padding: (thm) => thm.spacing(4),
          }}
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
