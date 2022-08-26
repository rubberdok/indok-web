import { alpha, ThemeOptions } from "@mui/material/styles";

const ToggleButtonGroup: ThemeOptions["components"] = {
  MuiToggleButtonGroup: {
    defaultProps: {
      color: "primary",
    },

    styleOverrides: {
      root: ({ theme }) => ({
        border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        "& .MuiToggleButton-root": {
          border: "none",
          margin: 4,
          borderRadius: `${theme.shape.borderRadius}px !important`,
          "& Mui-disabled": {
            border: "none",
          },
        },
      }),
    },
  },
};

export default ToggleButtonGroup;
