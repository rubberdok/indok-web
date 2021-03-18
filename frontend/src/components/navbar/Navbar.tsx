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
import React, { ReactElement } from "react";
import NavbarLinks from "./NavbarLinks";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#022A2A",
  },
  title: {
    flexGrow: 1,
    margin: 0,
    fontSize: 24,
    color: "#b0aca5",

    "&:hover": {
      cursor: "pointer",
      color: "#fff",
    },
  },
  sectionDesktop: {
    display: "none",

    [theme.breakpoints.up("md")]: {
      display: "flex",
      height: "100%",
      alignItems: "center",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
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

  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <div className={classes.root}>
      <HideOnScroll>
        <AppBar color="primary" className={classes.appBar}>
          <Container style={{ maxWidth: "90vw" }}>
            <Toolbar>
              <Link href="/">
                <Typography variant="h6" className={classes.title}>
                  INDØK
                </Typography>
              </Link>
              <div className={classes.sectionDesktop}>
                <NavbarLinks></NavbarLinks>
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
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <NavbarLinks></NavbarLinks>
      </Drawer>
    </div>
  );
};

export default Navbar;
