import { useQuery } from "@apollo/client";
import { GET_USER_INFO } from "@graphql/users/queries";
import { UserInfo } from "@interfaces/users";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import MenuIcon from "@mui/icons-material/Menu";
import leftFern from "@public/static/anniversary/left_fern.svg";
import rightFern from "@public/static/anniversary/right_fern.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import NavbarLinks from "./NavbarLinks";
import NavbarUser from "./NavbarLinks/NavbarUser";

//set navbar style breakpoint, should be adjusted according to width of NavbarLinks
export const breakpoint = 1150;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: theme.palette.primary.dark,
    backgroundImage: "url('/static/anniversary/sparkles.gif')",
    backgroundPosition: "bottom",
  },
  toolbar: {
    height: theme.spacing(10),
  },
  drawer: {
    width: theme.spacing(30),
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

  const [openDrawer, setOpenDrawer] = useState(false);

  const { error, loading, data } = useQuery<{ user: UserInfo | null }>(GET_USER_INFO);
  const loggedIn = !error && !loading && data?.user?.firstName !== undefined;

  return (
    <div className={classes.root}>
      <HideOnScroll>
        <AppBar color="primary" className={classes.appBar}>
          <Container className={classes.container}>
            <Toolbar className={classes.toolbar}>
              <Box className={classes.title}>
                <Box height="auto" width={38} position="relative">
                  <Image src={leftFern} layout="fill" alt="" />
                </Box>
                <Link href="/" passHref>
                  <Typography component="a" className={classes.titleLink} variant="h5">
                    INDØK
                  </Typography>
                </Link>
                <Box height="auto" width={38} position="relative">
                  <Image src={rightFern} layout="fill" alt="" />
                </Box>
              </Box>
              <div className={classes.sectionDesktop}>
                <NavbarLinks loggedIn={loggedIn} />
                <NavbarUser loggedIn={loggedIn} username={data?.user?.firstName} />
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  onClick={() => setOpenDrawer(true)}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  size="large"
                >
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
        <NavbarUser loggedIn={loggedIn} username={data?.user?.firstName} />
        <NavbarLinks loggedIn={loggedIn} />
      </Drawer>
    </div>
  );
};

export default Navbar;
