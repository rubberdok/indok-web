import { Theme } from "@mui/material/styles";

const Menu: any = (theme: Theme) => {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
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
        },
      },
    },
  };
};

export default Menu;
