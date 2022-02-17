import {
  AppBar,
  Container,
  Drawer,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useEffect } from "react";
import NavbarLinks from "./NavbarLinks";
import { useQuery } from "@apollo/client";
import { GET_USER } from "@graphql/users/queries";
import { User } from "@interfaces/users";
import NavbarUser from "./NavbarUser";

//set navbar style breakpoint, should be adjusted according to width of NavbarLinks
export const breakpoint = 1216;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#022A2A",
  },
  drawer: {
    width: 250,
  },
  title: {
    flexGrow: 1,
    margin: 0,
    color: "#b0aca5",

    "&:hover": {
      cursor: "pointer",
      color: "#fff",
    },
  },
  sectionDesktop: {
    display: "none",

    [theme.breakpoints.up(breakpoint)]: {
      display: "flex",
      height: "100%",
      alignItems: "center",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up(breakpoint)]: {
      display: "none",
    },
  },
  container: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "90vw",
    },
  },
}));

const HideOnScroll: React.FC = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children as ReactElement}
    </Slide>
  );
};

const Navbar: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const [openDrawer, setOpenDrawer] = useState(false);

  const { error, loading, data: userData } = useQuery<{ user: User }>(GET_USER);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setLoggedIn(!error && !loading && userData?.user?.firstName !== undefined);
  }, [error, loading, userData]);

  return (
    <div className={classes.root}>
      <HideOnScroll>
        <AppBar color="primary" className={classes.appBar}>
          <Container className={classes.container}>
            <Toolbar>
              <Link href="/">
                <Typography variant="h5" className={classes.title}>
                  INDØK
                </Typography>
              </Link>
              <div className={classes.sectionDesktop}>
                <NavbarLinks loggedIn={loggedIn} />
                <NavbarUser loggedIn={loggedIn} username={loggedIn ? userData?.user?.firstName ?? "" : undefined} />
              </div>
              <div className={classes.sectionMobile}>
                <IconButton onClick={() => setOpenDrawer(true)} edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      {router.pathname != "/" && <Toolbar id="back-to-top-anchor" />}
      <Drawer
        PaperProps={{ className: classes.drawer }}
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <NavbarUser loggedIn={loggedIn} username={loggedIn ? userData?.user?.firstName ?? "" : undefined} />
        <NavbarLinks loggedIn={loggedIn} />
      </Drawer>
    </div>
  );
};

export default Navbar;
