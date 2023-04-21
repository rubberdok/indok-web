import { NavigateNext } from "@mui/icons-material";
import { BreadcrumbsProps, Breadcrumbs as MUIBreadcrumbs, SxProps } from "@mui/material";

import Link from "@/components/Link";

export type TLink = {
  name: string;
  href: string;
};

type LinkItemProps = {
  link: TLink;
  active?: boolean;
};

const LinkItem: React.FC<LinkItemProps> = ({ link, active }) => {
  const { href, name } = link;
  return (
    <Link href={href} variant="body3" color={active ? "text.primary" : "text.secondary"}>
      {name}
    </Link>
  );
};

export interface Props extends BreadcrumbsProps {
  links: TLink[];
  sx?: SxProps;
}

export const Breadcrumbs: React.FC<React.PropsWithChildren<Props>> = ({ links, sx, ...props }) => {
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
};
