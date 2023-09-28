import { alpha, ThemeOptions } from "@mui/material/styles";

export const Input: ThemeOptions["components"] = {
  MuiTextField: {
    defaultProps: {
      variant: "filled",
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
      }),
    },
  },
  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        "&.Mui-error": {
          backgroundColor: `rgba(${theme.vars.palette.error.mainChannel} / 0.08)`,
        },
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.grey[500], 0.32),
        },
        "&.Mui-disabled": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars.palette.action.disabledBackground,
          },
        },
      }),
    },
  },
};
