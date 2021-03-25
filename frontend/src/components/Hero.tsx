import { Box, Button, Container, Grid, Hidden, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Link from "next/link";
import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";

const organizations = [
  {
    id: 1,
    title: "Janus",
    link: "https://www.januslinjeforening.no/",
    img: "img/gang.jpg",
  },
  {
    id: 2,
    title: "Bindeleddet",
    link: "https://bindeleddet.no/",
    img: "img/bindeleddet.jpg",
  },
  {
    id: 3,
    title: "ESTIEM",
    link: "https://sites.google.com/view/estiem-ntnu",
    img: "img/estiem.jpg",
  },
  {
    id: 4,
    title: "Hyttestyret",
    link: "/about/organizations/hyttestyret",
    img: "img/hytte.jpg",
  },
  {
    id: 5,
    title: "Indøk Kultur",
    link: "/about/organization?category=kultur#orgList",
    img: "img/indok-kultur.jpg",
  },
  {
    id: 6,
    title: "Janus IF",
    link: "/about/organization?category=idrett#orgList",
    img: "img/janus-if.jpg",
  },
];

const useStyles = makeStyles((theme) => ({
  hero: {
    color: "black",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  heroCard: {
    marginTop: -70,
    padding: "32px 48px",
  },
  relative: {
    position: "relative",
    height: "100%",
  },
  container: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "90vw",
    },
    height: "70vh",
    paddingTop: "25vh",
  },
  height: {
    height: "inherit",
  },
  orgLink: {
    color: "black",
    position: "relative",
    left: 12,
    transition: "0.3s all ease",

    ["& h3"]: {
      fontWeight: 500,
    },

    ["&:hover"]: {
      textDecoration: "none",
      left: 0,
    },

    ["&:hover h3"]: {
      fontWeight: 800,
    },

    ["& h3, & svg"]: {
      transition: "0.3s all ease",
    },
  },
  orgBg: {
    transition: "0.4s all linear",
    backgroundPosition: "center!important",
    backgroundSize: "cover!important",

    ["&::before"]: {
      background: "rgb(0 11 11 / 77%)",
      content: "''",
      display: "block",
      height: "100%",
      position: "absolute",
      width: "100%",
    },
  },
  orgIcon: {
    marginBottom: 18,
    color: "rgb(0 0 0 / 55%)",
  },
  hide: {
    opacity: "0!important",
    backgroundPosition: "calc(50% + 20px) center!important",
  },
  nth: {
    transition: "0.7s all ease",
    background: "url('nth.svg')",
    backgroundSize: "contain",
    backgroundPosition: "left bottom!important",
    backgroundRepeat: "no-repeat",
    opacity: 0.04,
    height: "70vh",
    marginLeft: "-28vh",
    top: "-4vh",
  },
}));

const Hero: React.FC = () => {
  const classes = useStyles();
  const [isShown, setIsShown] = useState("");

  return (
    <Box id="back-to-top-anchor" height="100vh" position="relative">
      <Grid container style={{ height: "100%", position: "absolute", zIndex: -1, background: "black" }}>
        <Grid item xs={12} md={8} className={classes.relative}>
          <Hidden smDown>
            {organizations.map((item) => (
              <Box
                key={item.id}
                className={[classes.orgBg, isShown == item.img ? "" : classes.hide].join(" ")}
                position="absolute"
                width="100%"
                height="100%"
                style={{ backgroundImage: "url(" + item.img + ")" }}
                zIndex="-1"
              ></Box>
            ))}
          </Hidden>
          <Box
            className={[classes.orgBg, isShown == "" ? "" : classes.hide].join(" ")}
            position="absolute"
            width="100%"
            height="100%"
            zIndex="-1"
            style={{ backgroundImage: "url(img/hero.jpg)" }}
          ></Box>
        </Grid>
        <Hidden smDown>
          <Grid item xs={4} className={classes.relative}>
            <Box position="absolute" width="100%" height="100%" style={{ background: "white" }} zIndex="-3"></Box>

            <Box className={classes.nth} position="absolute" width="100%" height="100%" zIndex="-2"></Box>
          </Grid>
        </Hidden>
      </Grid>
      <Container className={classes.container}>
        <Grid container className={classes.height}>
          <Grid item xs={12} md={5}>
            <Box
              style={{ color: "white" }}
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <Typography variant="overline">Foreningen for studentene ved</Typography>
              <Fade duration={700} cascade triggerOnce direction="up">
                <Typography style={{ color: "white" }} variant="h1">
                  Industriell Økonomi og Teknologiledelse
                </Typography>
                <br />
                <Link href="./about" passHref>
                  <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                    Les om foreningen
                  </Button>
                </Link>
                <Link href="./events" passHref>
                  <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                    Arrangementer
                  </Button>
                </Link>
                <Link href="./cabins" passHref>
                  <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                    Book hytte
                  </Button>
                </Link>
              </Fade>
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid item xs={7}>
              <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="flex-end">
                <Typography variant="overline">Linjeforeningene våre</Typography>
                <Fade damping={0.1} cascade triggerOnce direction="up">
                  {organizations.map((item) => (
                    <a
                      rel="noreferrer"
                      onMouseEnter={() => setIsShown(item.img)}
                      onMouseLeave={() => setIsShown("")}
                      href={item.link}
                      className={classes.orgLink}
                      key={item.id}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="h3" gutterBottom>
                          {item.title}
                        </Typography>
                        <NavigateNextIcon fontSize="large" className={classes.orgIcon} />
                      </Box>
                    </a>
                  ))}
                </Fade>
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
