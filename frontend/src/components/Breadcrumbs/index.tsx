import { Box, Breadcrumbs as MUIBreadcrumbs, BreadcrumbsProps, SxProps, Typography } from "@mui/material";
import { CaretRight } from "phosphor-react";
import { ReactElement } from "react";
import LinkItem from ".";

export type TLink = {
  href?: string;
  name?: string;
  icon?: ReactElement;
};

type Props = {
  links: TLink[];
  activeLast?: boolean;
  onDark?: boolean;
  sx?: SxProps;
} & BreadcrumbsProps;

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

export default Breadcrumbs;
