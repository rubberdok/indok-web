import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";

const organizations = [
  {
    id: 1,
    title: "Bindeleddet",
    link: "https://bindeleddet.no/",
    img: "img/bindeleddet.jpg",
  },
  {
    id: 2,
    title: "ESTIEM",
    link: "https://bindeleddet.no/",
    img: "img/estiem.jpg",
  },
  {
    id: 3,
    title: "Indøk Kultur",
    link: "https://bindeleddet.no/",
    img: "img/indok-kultur.jpg",
  },
  {
    id: 4,
    title: "Hyttestyret",
    link: "https://bindeleddet.no/",
    img: "img/hytte.jpg",
  },
  {
    id: 5,
    title: "Janus",
    link: "https://bindeleddet.no/",
    img: "img/gang.jpg",
  },
  {
    id: 6,
    title: "Janus IF",
    link: "https://bindeleddet.no/",
    img: "img/janus-if.jpg",
  },
];

const useStyles = makeStyles(() => ({
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
    maxWidth: "90vw",
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
    fontWeight: 100,

    ["&:hover"]: {
      textDecoration: "none",
      left: 0,
    },

    ["&:hover h2"]: {
      fontWeight: 800,
    },

    ["& h2, & svg"]: {
      marginBottom: 16,
      fontSize: 36,
      fontWeight: 550,
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
    marginTop: 9,
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
        <Grid item xs={8} className={classes.relative}>
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
          <Box
            className={[classes.orgBg, isShown == "" ? "" : classes.hide].join(" ")}
            position="absolute"
            width="100%"
            height="100%"
            zIndex="-1"
            style={{ backgroundImage: "url(img/hero.jpg)" }}
          ></Box>
        </Grid>
        <Grid item xs={4} className={classes.relative}>
          <Box position="absolute" width="100%" height="100%" style={{ background: "white" }} zIndex="-3"></Box>

          <Box className={classes.nth} position="absolute" width="100%" height="100%" zIndex="-2"></Box>
        </Grid>
      </Grid>
      <Container className={classes.container}>
        <Grid container className={classes.height}>
          <Grid item xs={5}>
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
                <Typography style={{ color: "white" }} variant="h2">
                  Industriell Økonomi <br />
                  og Teknologiledelse
                </Typography>
                <br />
                <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                  Les om foreningen
                </Button>
                <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                  Arrangementer
                </Button>
                <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                  Book hytte
                </Button>
              </Fade>
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="overline">Linjeforeningene våre</Typography>
              <Fade damping={0.1} cascade triggerOnce direction="up">
                {organizations.map((item) => (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setIsShown(item.img)}
                    onMouseLeave={() => setIsShown("")}
                    href={item.link}
                    className={classes.orgLink}
                    key={item.id}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography variant="h2">{item.title}</Typography>
                      <NavigateNextIcon fontSize="large" className={classes.orgIcon} />
                    </Box>
                  </a>
                ))}
              </Fade>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
