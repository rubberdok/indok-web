import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const RouteLink = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    color: theme.vars.palette.text.primary,
  },
}));
