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
import React, { ReactElement } from "react";
import NavbarLinks from "./NavbarLinks";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    // background: "transparent",
  },
  toolBar: {
    padding: 0,
  },
  title: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
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

  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <div className={classes.root}>
      <HideOnScroll>
        <AppBar color="default" className={classes.appBar}>
          <Container style={{ maxWidth: "90vw" }}>
            <Toolbar className={classes.toolBar}>
              <Link href="/">
                <Typography variant="h6" className={classes.title}>
                  {/* INDØK */}
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
      {/* <Toolbar id="back-to-top-anchor" /> */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <NavbarLinks></NavbarLinks>
      </Drawer>
    </div>
  );
};

export default Navbar;
