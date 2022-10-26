import { Box, Link } from "@mui/material";
import NextLink from "next/link";

import { TLink } from "../types";

type Props = {
  link: TLink;
  onDark?: boolean;
};

export const LinkItem: React.FC<React.PropsWithChildren<Props>> = ({ link, onDark }) => {
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
};
