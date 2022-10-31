import { ChevronRight } from "@mui/icons-material";
import { Box, Breadcrumbs as MUIBreadcrumbs, BreadcrumbsProps, SxProps, Typography } from "@mui/material";

import { LinkItem } from "./LinkItem";
import { TLink } from "./types";

export interface Props extends BreadcrumbsProps {
  links: TLink[];
  activeLast?: boolean;
  onDark?: boolean;
  sx?: SxProps;
}

export const Breadcrumbs: React.FC<React.PropsWithChildren<Props>> = ({
  links,
  sx,
  activeLast = false,
  onDark = false,
  ...other
}) => {
  const currentLink = links[links.length - 1];

  const currentPath = activeLast ? (
    <LinkItem key={currentLink.name} link={currentLink} onDark={onDark} />
  ) : (
    <Typography
      noWrap
      variant="body3"
      sx={(theme) => ({
        color: theme.palette.text.primary,
        ...(onDark && {
          opacity: 0.48,
          color: "common.white",
        }),
      })}
    >
      {currentLink.name || ""}
    </Typography>
  );
  const path = links.slice(0, -1).map((link) => <LinkItem key={link.name} link={link} onDark={onDark} />);

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
          <ChevronRight sx={{ fontSize: 12 }} />
        </Box>
      }
      {...other}
    >
      {path}
      {currentPath}
    </MUIBreadcrumbs>
  );
};
