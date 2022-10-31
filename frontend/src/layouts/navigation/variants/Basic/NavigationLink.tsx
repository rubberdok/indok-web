import Link from "next/link";

import { Route } from "../../types";

import { RouteLink } from "./styles";

type Props = {
  route: Route;
  active?: boolean;
};

export const NavigationLink: React.FC<Props> = ({ route, active }) => {
  return (
    <Link href={route.path} passHref>
      <RouteLink
        active={active}
        variant="body2"
        fontWeight={(theme) => theme.typography.fontWeightMedium}
        color={(theme) => (active ? theme.palette.text.primary : theme.palette.text.secondary)}
      >
        {route.title}
      </RouteLink>
    </Link>
  );
};
