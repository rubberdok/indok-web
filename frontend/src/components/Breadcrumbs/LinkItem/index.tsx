import { Box } from "@mui/material";

import { Link } from "@/components";

import { TLink } from "../types";

type Props = {
  link: TLink;
  onDark?: boolean;
};

export const LinkItem: React.FC<Props> = ({ link, onDark }) => {
  const { href = "", name, icon } = link;
  return (
    <Link
      href={href}
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
  );
};
