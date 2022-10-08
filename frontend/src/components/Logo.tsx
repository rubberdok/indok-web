import { Box, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";
import { memo } from "react";

type Props = { sx?: SxProps };

// eslint-disable-next-line react/display-name
export const Logo: React.NamedExoticComponent<Props> = memo(({ sx }) => {
  return (
    <NextLink href="/" passHref>
      <Box
        sx={{
          width: 75,
          lineHeight: 0,
          cursor: "pointer",
          display: "inline-flex",
          ...sx,
        }}
      >
        <Typography variant="h4" component="span">
          INDØK
        </Typography>
      </Box>
    </NextLink>
  );
});
