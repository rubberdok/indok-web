import { Box, Stack } from "@mui/material";
import { useSelectedLayoutSegment } from "next/navigation";

import { LoginButton } from "@/app/components/LoginButton";
import { PermissionRequired } from "@/app/components/PermissionRequired";
import { ColorModeSwitcher } from "@/layouts/components/ColorModeSwitcher";

import { NavigationProps } from "../props";

import { NavigationLink } from "./NavigationLink";

export const Basic: React.FC<NavigationProps> = ({ routes }) => {
  const segment = useSelectedLayoutSegment();

  return (
    <Box sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={6}>
          {routes.map((route) => {
            if (route.permission)
              return (
                <PermissionRequired permission={route.permission} key={route.title}>
                  <NavigationLink route={route} active={route.segment === segment} />
                </PermissionRequired>
              );
            return <NavigationLink route={route} active={route.segment === segment} key={route.title} />;
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
