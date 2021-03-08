import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/auth/queries";
import { User } from "@interfaces/users";
import { Button, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core";
import { AccountCircleOutlined } from "@material-ui/icons";
import PersonIcon from "@material-ui/icons/LockOpen";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { DATAPORTEN_SCOPES, generateAuthURL } from "./utils";

const links = [
  {
    id: "1",
    title: "Hjem",
    href: "/",
  },
  {
    id: "2",
    title: "Om Foreningen",
    href: "/about",
  },
  {
    id: "3",
    title: "Arrangementer",
    href: "/events",
  },
  {
    id: "4",
    title: "Hyttebooking",
    href: "/cabins",
  },
];

const useStyles = makeStyles(() => ({
  navItem: {
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    marginLeft: 50,
    padding: "10px 0",
    "&:hover": {
      cursor: "pointer",
    },
    color: "white",
  },
  user: {
    color: "white",
    height: "100%",
    background: "#065A5A",
    padding: "25px 0",
    paddingLeft: 35,
    paddingRight: "calc(5vw + 15px)",
    marginRight: "calc(-15px - 5vw)",

    ["&:hover"]: {
      background: "#0b6666",
    },
  },
  menu: {
    width: 300,
  },
}));

const NavbarLinks: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const signInURL = generateAuthURL(
    process.env.NEXT_PUBLIC_DATAPORTEN_ID,
    process.env.NEXT_PUBLIC_DATAPORTEN_STATE,
    process.env.NEXT_PUBLIC_DATAPORTEN_REDIRECT_URI,
    DATAPORTEN_SCOPES
  );

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
        <Link key={item.id} href={item.href}>
          <p className={[router.pathname == item.href ? "active" : "", classes.navItem].join(" ")}>{item.title}</p>
        </Link>
      ))}

      {!userData || loading || !userData.user || error ? (
        <a className={[classes.navItem, classes.user].join(" ")} href={signInURL}>
          <PersonIcon fontSize="small" style={{ marginBottom: "-5px", marginRight: "16px" }} />
          Logg inn med Feide
        </a>
      ) : (
        <>
          <Link href="/archive">
            <p className={classes.navItem}>Arkiv</p>
          </Link>
          <Button
            className={[classes.navItem, classes.user].join(" ")}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircleOutlined fontSize="small" style={{ marginBottom: "-7px", marginRight: "16px" }} />
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
                <Typography variant="body1">Profil</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/logout">
                <Typography variant="body1">Logg ut</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default NavbarLinks;
