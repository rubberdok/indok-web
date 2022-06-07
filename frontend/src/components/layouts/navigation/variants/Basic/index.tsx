import LoginButton from "@components/layouts/components/LoginButton";
import PermissionRequired from "@components/authz/PermissionRequired";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { NavigationProps } from "../../types";
import NavigationLink from "./NavigationLink";

const Basic: React.FC<NavigationProps> = ({ routes }) => {
  const { pathname } = useRouter();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", ml: 6 }}>
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
      <LoginButton />
    </Stack>
  );
};

export default Basic;
