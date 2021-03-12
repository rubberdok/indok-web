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
    id: 1,
    title: "Hjem",
    href: "/",
  },
  {
    id: 2,
    title: "Om Foreningen",
    href: "/about",
  },
  {
    id: 3,
    title: "Organisasjoner",
    href: "/about/organizations",
    dropdown: [
      {
        id: 1,
        title: "Janus IF",
        href: "/about/organizations/sports",
      },
      {
        id: 2,
        title: "Indøk Kultur",
        href: "/about/organizations/culture",
      },
    ],
  },
  {
    id: 4,
    title: "Arrangementer",
    href: "/events",
  },
  {
    id: 5,
    title: "Hyttebooking",
    href: "/cabins",
  },
];

const useStyles = makeStyles(() => ({
  nav: {
    position: "relative",

    "&:hover $dropdown": {
      display: "block",
    },
  },
  navItem: {
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    color: "#b0aca5",

    "&:hover": {
      cursor: "pointer",
      color: "#fff",
      textDecoration: "none",
    },

    "&.active": {
      color: "#fff",
    },
  },
  user: {
    color: "white",
    height: "100%",
    background: "#065A5A",
    padding: "25px 0",
    marginLeft: 16,
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
        <>
          <div className={classes.nav}>
            <Link key={item.id} href={item.href}>
              <a className={[router.pathname == item.href ? "active" : "", classes.navItem].join(" ")}>{item.title}</a>
            </Link>
            {item.dropdown ? (
              <div className={classes.dropdown}>
                {item.dropdown.map((dropItem) => (
                  <Link key={dropItem.id} href={dropItem.href}>
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
        </>
      ))}

      {!userData || loading || !userData.user || error ? (
        <a className={[classes.navItem, classes.user].join(" ")} href={signInURL}>
          <PersonIcon fontSize="small" style={{ marginBottom: "-5px", marginRight: "16px" }} />
          Logg inn med Feide
        </a>
      ) : (
        <>
          <Link href="/archive">
            <a className={[router.pathname == "/archive" ? "active" : "", classes.navItem].join(" ")}>Arkiv</a>
          </Link>
          <Button
            className={[classes.navItem, classes.user].join(" ")}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircleOutlined fontSize="small" style={{ marginRight: "16px" }} />
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
