import { AppBar, Container, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Slide from "@material-ui/core/Slide";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import NavbarLinks from "./NavbarLinks";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {},
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

function HideOnScroll(props: any) {
  const { children, window } = props;

  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const Navbar: React.FC = (props) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, right: open });
  };

  return (
    <div className={classes.root}>
      <HideOnScroll {...props}>
        <AppBar color="default" className={classes.appBar}>
          <Container>
            <Toolbar className={classes.toolBar}>
              <Link href="/">
                <Typography variant="h6" className={classes.title}>
                  INDØK
                </Typography>
              </Link>
              <div className={classes.sectionDesktop}>
                <NavbarLinks></NavbarLinks>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Drawer anchor="right" open={state["right"]} onClose={toggleDrawer(false)}>
        <NavbarLinks></NavbarLinks>
      </Drawer>
    </div>
  );
};

export default Navbar;
