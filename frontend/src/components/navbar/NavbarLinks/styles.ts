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
    padding: "0 24px",

    [theme.breakpoints.down(breakpoint)]: {
      marginBottom: theme.spacing(3),
      lineHeight: 2,
      fontSize: "0.9rem",
    },

    "&:hover": {
      cursor: "pointer",
      color: "#fff",
      textDecoration: "none",

      [theme.breakpoints.down(breakpoint)]: {
        "&:not($user)": {
          color: theme.palette.primary.main,
        },
      },
    },

    "&.active": {
      color: "#fff",

      [theme.breakpoints.down(breakpoint)]: {
        color: theme.palette.primary.main,
      },
    },
  },
  user: {
    background: "#065A5A",
    color: "white",
    paddingTop: 23,
    paddingBottom: 22,
    height: "unset",

    [theme.breakpoints.up(breakpoint)]: {
      height: "100%",
      marginLeft: 16,
      padding: "27px 0",
      paddingLeft: 35,
      paddingRight: "calc(5vw + 15px)",
      marginRight: "calc(-15px - 5vw)",
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
    whiteSpace: "nowrap",
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
