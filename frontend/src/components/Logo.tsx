import { Box, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";
import { memo } from "react";

type Props = { sx?: SxProps };

/**
 * The Indøk logo
 *
 * The display name cannot be resolved if we wrap an arrow function in memo() directly,
 * hence this is wrapping a named function.
 */
export const Logo: React.FC<React.PropsWithChildren<Props>> = memo(function Logo({ sx }) {
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
