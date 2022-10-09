import { ThemeOptions } from "@mui/material";

export const Menu: ThemeOptions["components"] = {
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        "&.Mui-selected": {
          backgroundColor: theme.palette.action.selected,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        "& .MuiListItemIcon-root": {
          minWidth: "unset",
        },
      }),
    },
  },
};
