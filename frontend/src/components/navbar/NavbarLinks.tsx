import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import { Box, Button, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { AccountCircleOutlined, LockOpen } from "@material-ui/icons";
import { DATAPORTEN_SCOPES } from "@utils/auth";
import { generateQueryString } from "@utils/helpers";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import links from "./links";
import { breakpoint } from "./Navbar";

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
    background: "#022a2a",
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

const NavbarLinks: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const queryString = generateQueryString({
    client_id: process.env.NEXT_PUBLIC_DATAPORTEN_ID,
    state: process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    redirect_uri: process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    response_type: "code",
    scope: DATAPORTEN_SCOPES.join(" "),
  });
  const signInURL = "https://auth.dataporten.no/oauth/authorization" + queryString;

  const { loading, error, data: userData } = useQuery<{ user: User }>(GET_USER);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      {!userData || loading || !userData.user || error ? (
        <>
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
          <Link href={signInURL} passHref>
            <Button className={[classes.navItem, classes.user].join(" ")} startIcon={<LockOpen fontSize="small" />}>
              Logg inn med Feide
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Box position="relative">
            <Link href="/archive">
              <a className={[router.pathname == "/archive" ? "active" : "", classes.navItem].join(" ")}>Arkiv</a>
            </Link>
          </Box>
          <Button
            className={[classes.navItem, classes.user].join(" ")}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            startIcon={<AccountCircleOutlined fontSize="small" />}
          >
            {userData.user.firstName}
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={open}
            onClose={handleClose}
            className={classes.menu}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/profile">
                <a>Profil</a>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/logout">
                <a>Logg ut</a>
              </Link>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default NavbarLinks;
