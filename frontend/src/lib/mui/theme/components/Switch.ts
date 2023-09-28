import { alpha, ThemeOptions } from "@mui/material/styles";

export const Switch: ThemeOptions["components"] = {
  MuiSwitch: {
    styleOverrides: {
      root: {
        padding: "9px 13px 9px 12px",
        width: 58,
        height: 38,
      },
      thumb: ({ theme }) => ({
        width: 14,
        height: 14,
        boxShadow: "none",
        color: `${theme.vars.palette.common.white} !important`,
      }),
      track: ({ theme }) => ({
        opacity: 1,
        borderRadius: 10,
        backgroundColor: alpha(theme.palette.grey[500], 0.48),
      }),
      switchBase: {
        padding: 12,
        left: 3,
        "&.Mui-checked": {
          transform: "translateX(13px)",
          "&+.MuiSwitch-track": {
            opacity: 1,
          },
          "&.Mui-disabled": {
            "&+.MuiSwitch-track": {
              opacity: 0.48,
            },
          },
        },
        "&.Mui-disabled": {
          "&+.MuiSwitch-track": {
            opacity: 0.5,
          },
        },
      },
    },
  },
};
