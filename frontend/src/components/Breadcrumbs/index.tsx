import { Box, Breadcrumbs as MUIBreadcrumbs, BreadcrumbsProps, SxProps, Typography } from "@mui/material";
import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "./Link";
import { TLink } from "./types";

interface Props extends BreadcrumbsProps {
  links: TLink[];
  activeLast?: boolean;
  onDark?: boolean;
  sx?: SxProps;
}

const Breadcrumbs: React.FC<Props> = ({ links, sx, activeLast = false, onDark = false, ...other }) => {
  const currentLink = links[links.length - 1];

  const currentPath = activeLast ? (
    <Link key={currentLink.name} link={currentLink} onDark={onDark} />
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
  const path = links.slice(0, -1).map((link) => <Link key={link.name} link={link} onDark={onDark} />);

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
          <ChevronRightIcon width={12} height={12} />
        </Box>
      }
      {...other}
    >
      {path}
      {currentPath}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
