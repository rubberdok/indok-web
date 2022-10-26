import Link from "next/link";
import { MouseEventHandler } from "react";

import { Route } from "../../types";

import { RouteLink } from "./styles";

type Props = {
  active?: boolean;
  route: Route;
  onClick?: MouseEventHandler<HTMLSpanElement>;
};

export const NavigationLink: React.FC<React.PropsWithChildren<Props>> = ({ active, route, onClick }) => {
  return (
    <Link href={route.path} passHref>
      <RouteLink
        onClick={onClick}
        variant="body2"
        fontWeight={(theme) => theme.typography.fontWeightMedium}
        color={(theme) => (active ? theme.palette.text.primary : theme.palette.text.secondary)}
      >
        {route.title}
      </RouteLink>
    </Link>
  );
};
