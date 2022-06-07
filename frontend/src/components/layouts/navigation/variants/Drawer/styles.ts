import { Typography } from "@mui/material";
import { styled } from "@mui/system";

export const RouteLink = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));
