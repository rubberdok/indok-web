import React from "react";
import { ComponentOverride } from "./types";

const Menu: ComponentOverride = (theme) => {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...(theme.typography.body2 as React.CSSProperties),
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
        },
      },
    },
  };
};

export default Menu;
