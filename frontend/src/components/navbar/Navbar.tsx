import {
  AppBar,
  Box,
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
import Image from "next/image";
import { default as Link } from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import NavbarLinks from "./NavbarLinks";

//set navbar style breakpoint, should be adjusted according to width of NavbarLinks
export const breakpoint = 1216;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#0b2c1e", //Original color: #022A2A
    backgroundImage: "url('/static/anniversary/sparkles.gif')",
    backgroundPosition: "bottom",
  },
  drawer: {
    [theme.breakpoints.down(breakpoint)]: {
      flexDirection: "column-reverse",
      justifyContent: "flex-end",
    },
    width: 250,
  },
  title: {
    flexGrow: 1,
    margin: 0,
    display: "flex",
    flexDirection: "row",
  },
  titleLink: {
    color: "#eec643", //b0aca5

    "&:hover": {
      color: "#ffd754",
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

  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <div className={classes.root}>
      <HideOnScroll>
        <AppBar color="primary" className={classes.appBar}>
          <Container className={classes.container}>
            <Toolbar>
              <Box className={classes.title}>
                <Box height="auto" width={38} position="relative">
                  <Image src="/static/anniversary/left_fern.svg" layout="fill" alt="left fern" />
                </Box>
                <Link href="/" passHref>
                  <Typography component="a" className={classes.titleLink} variant="h5">
                    INDØK
                  </Typography>
                </Link>
                <Box height="auto" width={38} position="relative">
                  <Image src="/static/anniversary/right_fern.svg" layout="fill" alt="right fern" />
                </Box>
              </Box>
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
      <Drawer
        PaperProps={{ className: classes.drawer }}
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <NavbarLinks></NavbarLinks>
      </Drawer>
    </div>
  );
};

export default Navbar;
