import { ThemeOptions } from "@mui/material";

export const Slider: ThemeOptions["components"] = {
  MuiSlider: {
    defaultProps: {
      size: "small",
    },

    styleOverrides: {
      markLabel: ({ theme }) => ({
        fontSize: 13,
        color: theme.vars.palette.text.disabled,
      }),
      valueLabel: ({ theme }) => ({
        borderRadius: 8,
        backgroundColor: theme.vars.palette.grey[800],
      }),
    },
  },
};
