import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";

import { PermissionRequired } from "@/components/Auth";
import { ColorModeSwitcher } from "@/layouts/components/ColorModeSwitcher";
import { LoginButton } from "@/layouts/components/LoginButton";

import { NavigationProps } from "../../types";

import { NavigationLink } from "./NavigationLink";

export const Basic: React.FC<NavigationProps> = ({ routes }) => {
  const { pathname } = useRouter();
  return (
    <Box sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={6}>
          {routes.map((route) => {
            if (route.permission)
              return (
                <PermissionRequired permission={route.permission} key={route.title}>
                  <NavigationLink route={route} active={pathname.includes(route.path)} />
                </PermissionRequired>
              );
            return <NavigationLink route={route} active={pathname.includes(route.path)} key={route.title} />;
          })}
        </Stack>
        <Stack direction="row" gap={2}>
          <LoginButton data-test-id="app-bar-login" />
          <ColorModeSwitcher />
        </Stack>
      </Stack>
    </Box>
  );
};
