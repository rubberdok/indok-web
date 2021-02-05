import { Box, Button, Container, Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
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
    color: "white",
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
    paddingTop: "21vh",
  },
  height: {
    height: "inherit",
  },
  orgLink: {
    color: "black",
    position: "relative",
    left: 12,
    transition: "0.3s all linear",

    ["&:hover"]: {
      textDecoration: "none",
      left: 0,
    },

    ["& h2, & svg"]: {
      marginBottom: 16,
    },

    // ["&::before"]: {
    //   content: "''",
    //   transition: "1s all ease",
    // },

    // ["&:hover::before"]: {
    //   width: "calc(100% + 32px)",
    //   height: 30,
    //   content: "''",
    //   position: "absolute",
    //   background: "rgb(11 60 60 / 58%)",
    //   bottom: -2,
    //   zIndex: -1,
    //   right: 0,
    // },
  },
  orgBg: {
    transition: "0.4s all linear",
    backgroundPosition: "center!important",
    backgroundSize: "cover!important",

    ["&::before"]: {
      background: "linear-gradient(to right, rgb(255 255 255 / 40%), rgb(255 255 255 / 88%))",
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
    background: "url('nth.png')",
    backgroundSize: "cover",
    backgroundPosition: "left bottom!important",
    backgroundRepeat: "no-repeat",
    opacity: 0.03,
    zIndex: -2,
    height: "85vh",
    marginLeft: "-20vh",
  },
}));

const Hero: React.FC = () => {
  const classes = useStyles();
  const [isShown, setIsShown] = useState("");

  return (
    <Box id="back-to-top-anchor" height="100vh" position="relative">
      <Grid container style={{ height: "100%", position: "absolute", zIndex: -1 }}>
        <Grid item xs={6} className={classes.relative}>
          <Box position="absolute" width="100%" height="100%" style={{ background: "white" }} zIndex="-1"></Box>
        </Grid>
        <Grid item xs={6} className={classes.relative}>
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
            className={[classes.nth, isShown == "" ? "" : classes.hide].join(" ")}
            position="absolute"
            width="100%"
            height="100%"
            zIndex="-1"
          ></Box>
        </Grid>
      </Grid>
      <Container className={classes.container}>
        <Grid container className={classes.height}>
          <Grid item xs={5}>
            <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="overline">Foreningen for studentene ved</Typography>
              <Fade duration={700} cascade triggerOnce direction="up">
                <Typography variant="h3">
                  Industriell Økonomi <br />
                  og Teknologiledelse
                </Typography>
                <br />
                <Button size="large" startIcon={<NavigateNextIcon />}>
                  Les om foreningen
                </Button>
                <Button size="large" startIcon={<NavigateNextIcon />}>
                  Arrangementer
                </Button>
                <Button size="large" startIcon={<NavigateNextIcon />}>
                  Book hytte
                </Button>
                <br />
                <br />
                <br />
              </Fade>
              <Typography variant="overline" gutterBottom>
                Nyttige lenker
              </Typography>
              <IconButton>
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="overline">Foreningene under hovedstyret</Typography>
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
      <Box position="absolute" right="0" top="0" m="24px 24px 0 0">
        <Button color="primary" size="medium" variant="contained" endIcon={<MeetingRoomIcon />}>
          Logg inn
        </Button>
      </Box>
      <Box position="absolute" left="0" top="0" m="24px 0 0 24px">
        <Button color="primary" size="medium" variant="contained" startIcon={<MailOutlineIcon />}>
          Kontakt
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
