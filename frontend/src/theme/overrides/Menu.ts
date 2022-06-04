import { experimental_sx as sx } from "@mui/material";
import { ComponentOverride } from "./types";

const Menu: ComponentOverride = (theme) => {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...sx({
            typography: theme.typography.body2,
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
          }),
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "& .MuiListItemIcon-root": {
            minWidth: "unset",
          },
        },
      },
    },
  };
};

export default Menu;
