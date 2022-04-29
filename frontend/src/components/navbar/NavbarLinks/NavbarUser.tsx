import { Button, Menu, MenuItem } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { AccountCircleOutlined, LockOpen } from "@mui/icons-material";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useState } from "react";
import { breakpoint } from "../Navbar";
import { useSharedStyles } from "./styles";

const useStyles = makeStyles((theme) => ({
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
}));

type Props = {
  loggedIn: boolean;
  username?: string;
};

const NavbarUser: React.VFC<Props> = ({ loggedIn, username }) => {
  const classes = { ...useSharedStyles(), ...useStyles() };

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
            {username}
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
