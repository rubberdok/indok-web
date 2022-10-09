import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const WarningButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.error.main),
  backgroundColor: theme.palette.error.main,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));
