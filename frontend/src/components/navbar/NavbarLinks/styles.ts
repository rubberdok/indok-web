import makeStyles from "@mui/styles/makeStyles";
import { breakpoint } from "../Navbar";

export const useSharedStyles = makeStyles((theme) => ({
  navItem: {
    ...theme.typography.overline,
    display: "flex",
    whiteSpace: "nowrap",
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),

    [theme.breakpoints.up(breakpoint)]: {
      height: "100%",
      alignItems: "center",
    },

    [theme.breakpoints.down(breakpoint)]: {
      lineHeight: 2,
      fontSize: "0.9rem",
    },

    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
    },
  },
}));
