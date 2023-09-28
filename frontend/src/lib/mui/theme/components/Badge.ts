import { ThemeOptions } from "@mui/material";

export const Badge: ThemeOptions["components"] = {
  MuiBadge: {
    styleOverrides: {
      dot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
      },
    },
  },
};
