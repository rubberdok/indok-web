import { ThemeOptions } from "@mui/material";

const Chip: ThemeOptions["components"] = {
  MuiChip: {
    styleOverrides: {
      outlined: ({ theme }) => ({
        borderColor: theme.palette.grey[500],
        "&.MuiChip-colorPrimary": {
          borderColor: theme.palette.primary.main,
        },
        "&.MuiChip-colorSecondary": {
          borderColor: theme.palette.secondary.main,
        },
      }),
      //
      avatar: ({ theme }) => ({
        fontSize: theme.typography.subtitle2.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
      }),
    },
  },
};

export default Chip;
