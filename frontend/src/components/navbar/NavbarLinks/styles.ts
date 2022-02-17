import { makeStyles } from "@material-ui/core";
import { breakpoint } from "../Navbar";

export const useStyles = makeStyles((theme) => ({
  nav: {
    position: "relative",

    "&:hover $dropdown": {
      display: "block",
    },
  },
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
  nonUserNavItem: {
    [theme.breakpoints.down(breakpoint)]: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },

    "&:hover, &.active": {
      color: "#fff",
      [theme.breakpoints.down(breakpoint)]: {
        color: theme.palette.primary.main,
      },
    },
  },
  user: {
    background: "#065A5A",
    color: "white",

    [theme.breakpoints.up(breakpoint)]: {
      marginLeft: 16,
      paddingLeft: 35,
      paddingRight: "calc(5vw + 15px)",
      marginRight: "calc(-15px - 5vw)",
    },

    [theme.breakpoints.down(breakpoint)]: {
      height: theme.spacing(10),
      marginBottom: theme.spacing(1.5),
    },

    ["&:hover"]: {
      background: "#0b6666",
    },
  },
  menu: {
    width: 400,

    "& li": {
      margin: 0,
    },
  },

  dropdown: {
    display: "none",
    background: theme.palette.primary.dark,
    position: "absolute",
    paddingTop: 16,
    ["& $navItem"]: {
      marginTop: 10,
      marginBottom: 10,
    },
    [theme.breakpoints.down(breakpoint)]: {
      display: "none!important",
    },
  },
}));
