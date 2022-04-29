import { Box, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";
import { memo } from "react";

const Logo: React.FC<{ sx?: SxProps }> = ({ sx }) => {
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
        <Typography variant="h4">INDØK</Typography>
      </Box>
    </NextLink>
  );
};

export default memo(Logo);
