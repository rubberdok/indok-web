import { Theme } from "@mui/material/styles";
import typography from "../typography";

type Props = (theme: Theme) => Theme["components"];

const Menu: Props = (theme: Theme) => {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...typography.body2,
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
