import { Box, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";
import { memo } from "react";

type Props = { sx?: SxProps };

const Logo: React.FC<Props> = ({ sx }) => {
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
};

export default memo(Logo);
