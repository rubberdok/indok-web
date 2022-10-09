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
        backgroundColor: alpha(theme.palette.grey[500], 0.08),
        "&:hover": {
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
        },
        "&.Mui-error": {
          backgroundColor: alpha(theme.palette.error.main, 0.08),
        },
        "&.Mui-focused": {
          backgroundColor: theme.palette.action.focus,
        },
        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      }),
      input: ({ theme }) => ({
        ...theme.typography.body2,
      }),
      underline: ({ theme }) => ({
        "&:before": {
          borderBottomColor: alpha(theme.palette.grey[500], 0.56),
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
            borderColor: theme.palette.action.disabledBackground,
          },
        },
      }),
    },
  },
};
