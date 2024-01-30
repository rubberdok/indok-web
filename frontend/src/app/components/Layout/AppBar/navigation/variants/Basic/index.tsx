import { Box, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

import { LoginButton } from "@/app/components/LoginButton";
import { ColorModeSwitcher } from "@/layouts/components/ColorModeSwitcher";

import { PermissionRequired } from "../../../../../PermissionRequired";
import { NavigationProps } from "../../types";

import { NavigationLink } from "./NavigationLink";

export const Basic: React.FC<NavigationProps> = ({ routes }) => {
  const pathname = usePathname();

  return (
    <Box sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={6}>
          {routes.map((route) => {
            if (route.permission)
              return (
                <PermissionRequired permission={route.permission} key={route.title}>
                  <NavigationLink route={route} active={pathname?.includes(route.path)} />
                </PermissionRequired>
              );
            return <NavigationLink route={route} active={pathname?.includes(route.path)} key={route.title} />;
          })}
        </Stack>
        <Stack direction="row" gap={2}>
          <ColorModeSwitcher />
          <LoginButton data-test-id="app-bar-login" />
        </Stack>
      </Stack>
    </Box>
  );
};
