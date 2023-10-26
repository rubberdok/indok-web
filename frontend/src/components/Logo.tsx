import { Box, SxProps, Typography } from "@mui/material";

import Link from "./Link";

type Props = { sx?: SxProps };

/**
 * The Indøk logo
 *
 * The display name cannot be resolved if we wrap an arrow function in memo() directly,
 * hence this is wrapping a named function.
 */
export const Logo: React.FC<Props> = ({ sx }) => {
  return (
    <Link href="/" underline="none" color="text.primary">
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
    </Link>
  );
};
