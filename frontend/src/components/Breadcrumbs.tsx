import { Box, Breadcrumbs as MUIBreadcrumbs, BreadcrumbsProps, Link, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";
import { CaretRight } from "phosphor-react";
import { ReactElement } from "react";

type TLink = {
  href?: string;
  name: string | undefined;
  icon?: ReactElement;
};

interface Props extends BreadcrumbsProps {
  links: TLink[];
  activeLast?: boolean;
  onDark?: boolean;
  sx?: SxProps;
}

const Breadcrumbs: React.FC<Props> = ({ links, sx, activeLast = false, onDark = false, ...other }) => {
  const currentLink = links[links.length - 1].name;

  const listDefault = links.map((link) => <LinkItem key={link.name} link={link} onDark={onDark} />);

  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} onDark={onDark} />
      ) : (
        <Typography
          noWrap
          variant="body3"
          sx={{
            color: "text.disabled",
            ...(onDark && {
              opacity: 0.48,
              color: "common.white",
            }),
          }}
        >
          {currentLink || ""}
        </Typography>
      )}
    </div>
  ));

  return (
    <MUIBreadcrumbs
      sx={{
        "& .MuiBreadcrumbs-li": { whiteSpace: "nowrap" },
        "& .MuiBreadcrumbs-li:last-child": { flex: 1, overflow: "hidden", textOverflow: "ellipsis" },
        ...sx,
      }}
      separator={
        <Box
          sx={{
            ...(onDark && {
              opacity: 0.48,
              color: "common.white",
            }),
            lineHeight: 0,
          }}
        >
          <CaretRight width={16} height={16} />
        </Box>
      }
      {...other}
    >
      {activeLast ? listDefault : listActiveLast}
    </MUIBreadcrumbs>
  );
};

type LinkItemProps = {
  link: TLink;
  onDark?: boolean;
};

function LinkItem({ link, onDark }: LinkItemProps) {
  const { href = "", name, icon } = link;
  return (
    <NextLink key={name} href={href} passHref>
      <Link
        variant="body3"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.primary",
          "& > div": { display: "inherit" },
          ...(onDark && {
            color: "common.white",
          }),
        }}
      >
        {icon && (
          <Box
            sx={{
              mr: 1,
              "& svg": { width: 20, height: 20 },
            }}
          >
            {icon}
          </Box>
        )}
        {name}
      </Link>
    </NextLink>
  );
}

export default Breadcrumbs;
