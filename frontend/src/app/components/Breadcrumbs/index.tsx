import { NavigateNext } from "@mui/icons-material";
import { BreadcrumbsProps, Breadcrumbs as MUIBreadcrumbs, SxProps } from "@mui/material";
import { Route } from "next";

import { Link } from "../Link";

export type TLink<T extends string> = {
  name: string;
  href: Route<T> | URL;
};

type LinkItemProps<T extends string> = {
  link: TLink<T>;
  active?: boolean;
};

function LinkItem<T extends string>({ link, active }: LinkItemProps<T>) {
  const { href, name } = link;
  return (
    <Link href={href} variant="caption" color={active ? "text.primary" : "text.secondary"}>
      {name}
    </Link>
  );
}

export interface Props<T extends string> extends BreadcrumbsProps {
  links: TLink<T>[];
  sx?: SxProps;
}

export function Breadcrumbs<T extends string>({ links, sx, ...props }: React.PropsWithChildren<Props<T>>) {
  if (links.length === 0) return null;

  return (
    <MUIBreadcrumbs
      sx={sx}
      separator={
        <NavigateNext
          sx={(theme) => ({
            fontSize: 12,
            [theme.getColorSchemeSelector("dark")]: {
              opacity: 0.48,
            },
          })}
        />
      }
      {...props}
    >
      {links.map((link, index) => {
        if (index === links.length - 1) return <LinkItem key={link.name} link={link} active />;
        return <LinkItem key={link.name} link={link} />;
      })}
    </MUIBreadcrumbs>
  );
}
