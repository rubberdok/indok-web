import { Button, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { AccountCircleOutlined, LockOpen } from "@material-ui/icons";
import { breakpoint } from "./Navbar";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

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
    whiteSpace: "nowrap",
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

type Props = {
  loggedIn: boolean;
  username?: string;
};

const NavbarUser: React.VFC<Props> = ({ loggedIn, username }) => {
  const classes = useStyles();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const signInURL = generateFeideLoginUrl();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {!loggedIn ? (
        <Link href={signInURL} passHref>
          <Button
            className={[classes.navItem, classes.user].join(" ")}
            startIcon={<LockOpen fontSize="small" />}
            data-test-id="login"
          >
            Logg inn med Feide
          </Button>
        </Link>
      ) : (
        <>
          <Button
            className={[classes.navItem, classes.user].join(" ")}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            startIcon={<AccountCircleOutlined fontSize="small" />}
          >
            {loggedIn ? username : ""}
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

export default NavbarUser;
