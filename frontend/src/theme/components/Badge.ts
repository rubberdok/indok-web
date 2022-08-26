import { ThemeOptions } from "@mui/material";

const Badge: ThemeOptions["components"] = {
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

export default Badge;
