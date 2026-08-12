import { ThemeOptions } from "@mui/material";

export const Chip: ThemeOptions["components"] = {
  MuiChip: {
    styleOverrides: {
      root: {
        "& .MuiChip-icon": {
          color: "inherit",
        },
        "& .MuiChip-label": {
          color: "inherit",
        },
      },
    },
  },
};
