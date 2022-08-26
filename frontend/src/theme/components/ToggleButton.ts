import { alpha, ThemeOptions } from "@mui/material/styles";

const ToggleButton: ThemeOptions["components"] = {
  MuiToggleButton: {
    defaultProps: {},

    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
    },
  },

  MuiToggleButtonGroup: {
    defaultProps: {
      color: "primary",
    },

    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: theme.shadows[7],
        border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        "& .MuiToggleButton-root": {
          border: "none",
          margin: 4,
          borderRadius: `${theme.shape.borderRadius}px !important`,
          "&.Mui-disabled": {
            border: "none",
          },
        },
      }),
    },
  },
};

export default ToggleButton;
