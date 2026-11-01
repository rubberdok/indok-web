import { Theme } from "@mui/material";

export const adminPanelStyles = (theme: Theme) => ({
  "& .MuiPaper-elevation0": {
    border: `1px solid ${theme.vars.palette.divider}`,
  },
});
