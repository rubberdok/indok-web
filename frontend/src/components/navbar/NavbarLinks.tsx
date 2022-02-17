import { makeStyles, Box } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import links from "./links";
import { breakpoint } from "./Navbar";
import PermissionRequired from "@components/permissions/PermissionRequired";

const useStyles = makeStyles((theme) => ({
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
        color: theme.palette.primary.main,
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
    width: "100%",
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

type Props = {
  loggedIn: boolean;
};

const NavbarLinks: React.VFC<Props> = ({ loggedIn }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {links.map((item) => (
        <div key={item.id} className={classes.nav}>
          <Link href={item.href}>
            <a
              className={[item.href == "/" + router.pathname.split("/")[1] ? "active" : "", classes.navItem].join(" ")}
            >
              {item.title}
            </a>
          </Link>
          {item.dropdown ? (
            <div className={classes.dropdown}>
              {item.dropdown.map((dropItem) => (
                <Link key={dropItem.title} href={dropItem.href}>
                  <a className={[router.pathname == dropItem.href ? "active" : "", classes.navItem].join(" ")}>
                    {dropItem.title}
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
      {loggedIn ? (
        <Box position="relative">
          <a
            className={classes.navItem}
            href="https://www.ntnu.no/studier/mtiot"
            target="_blank"
            rel="noreferrer noopener"
          >
            Om studiet
          </a>
        </Box>
      ) : (
        <PermissionRequired permission="archive.view_archivedocument">
          <Box position="relative">
            <Link href="/archive">
              <a className={[router.pathname == "/archive" ? "active" : "", classes.navItem].join(" ")}>Arkiv</a>
            </Link>
          </Box>
        </PermissionRequired>
      )}
    </>
  );
};

export default NavbarLinks;
