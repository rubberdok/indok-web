import { Button, Menu, MenuItem } from "@material-ui/core";
import { AccountCircleOutlined, LockOpen } from "@material-ui/icons";
import { generateFeideLoginUrl } from "@utils/auth";
import Link from "next/link";
import { useState } from "react";
import { useStyles } from "./styles";

type Props = {
  loggedIn: boolean;
  username?: string;
};

const NavbarUser: React.VFC<Props> = ({ loggedIn, username }) => {
  const classes = useStyles();

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
