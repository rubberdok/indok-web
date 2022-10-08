import { alpha, ThemeOptions } from "@mui/material/styles";

export const Drawer: ThemeOptions["components"] = {
  MuiDrawer: {
    styleOverrides: {
      modal: ({ theme }) => ({
        '&[role="presentation"]': {
          "& .MuiDrawer-paperAnchorLeft": {
            boxShadow: `8px 24px 24px 12px ${alpha(
              theme.palette.grey[900],
              theme.palette.mode === "light" ? 0.16 : 0.48
            )}`,
          },
          "& .MuiDrawer-paperAnchorRight": {
            boxShadow: `-8px 24px 24px 12px ${alpha(
              theme.palette.grey[900],
              theme.palette.mode === "light" ? 0.16 : 0.48
            )}`,
          },
        },
      }),
    },
  },
};
