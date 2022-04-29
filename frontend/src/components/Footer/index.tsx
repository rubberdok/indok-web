import { Facebook, GitHub } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import rubberdokLogo from "@public/img/rubberdok_logo_white.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HallOfFame from "src/layouts/footer/HallOfFame";

const useStyles = makeStyles((theme) => ({
  footer: {
    color: "#b0aca5",
    background: "#022a2a",
    paddingBottom: theme.spacing(6),
    paddingTop: theme.spacing(6),
    position: "relative",
    zIndex: 0,
  },
  credits: {
    background: "#021c1c",
    position: "relative",
    display: "flex",
    height: 112,
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    color: "#b0aca5",
    [theme.breakpoints.down("md")]: {
      height: "unset",
      flexDirection: "column",
    },
  },
  creditsContent: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },

    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  title: {
    color: "#fff",

    "&:hover": {
      cursor: "pointer",
    },
  },
  nth: {
    background: "url('/static/anniversary/anniversary_logo_black.svg')",
    backgroundSize: 500,
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    opacity: 0.25,

    [theme.breakpoints.down("lg")]: {
      width: "100%",
      left: 0,
    },
  },
  rdLogo: {
    height: "100%",
    float: "left",

    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(4),
    },

    "&:hover": {
      cursor: "pointer",
    },
  },
  infoBox: {
    marginTop: -80,
    marginBottom: 72,
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div>
        <Box className={classes.footer}>
          <Container>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Link href="/" passHref>
                  <Typography variant="h5" className={classes.title} gutterBottom>
                    INDØK
                  </Typography>
                </Link>
                <Typography variant="body2">
                  Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU
                </Typography>
                <Typography variant="body2">Kolbjørn Hejes vei 1E, 7034 Trondheim</Typography>
                <Typography variant="body2">Org.nr. 994 778 463</Typography>
                <a href="mailto:leder@indokhs.no">
                  <Typography variant="body2">leder@indokhs.no</Typography>
                </a>
                <Link href="/report/">Baksida</Link>
                <Box mt={2}>
                  <a href="https://www.facebook.com/HovedstyretIndok" rel="noreferrer noopener" target="_blank">
                    <IconButton edge="start" size="small" aria-label="facebook" color="inherit">
                      <Facebook />
                    </IconButton>
                  </a>
                  <a href="https://github.com/rubberdok/indok-web" rel="noreferrer noopener" target="_blank">
                    <IconButton size="small" aria-label="github" color="inherit">
                      <GitHub />
                    </IconButton>
                  </a>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={classes.nth} position="absolute" width="600px" height="100%" top={0} zIndex={-1} />
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Box className={classes.credits}>
          <Container>
            <Box height="100%" display="flex" alignItems="center" className={classes.creditsContent}>
              <a
                className={classes.rdLogo}
                href="https://github.com/rubberdok/indok-web"
                rel="noreferrer noopener"
                style={{ height: "100%" }}
              >
                <Image src={rubberdokLogo} alt="Rubberdøk logo" width="67px" height="35px" layout="fixed" />
              </a>
              <Box flexGrow="1">
                <Typography variant="body2">
                  Forslag til nettsiden eller oppdaget en feil? Lag et issue på{" "}
                  <a href="https://github.com/rubberdok/indok-web/issues">GitHub</a>, eller send mail til{" "}
                  <a href="mailto:feedback@rubberdok.no">feedback@rubberdok.no</a>.
                </Typography>
                <Typography variant="body2">
                  Utviklet av{" "}
                  <a href="https://github.com/rubberdok/indok-web" rel="norefferer noopener">
                    Rubberdøk
                  </a>
                  , Hovedstyrets Webkomité. Kopirett © {new Date().getFullYear()} Foreningen for Studentene ved Indøk.
                  Alle rettigheter reservert.
                </Typography>
              </Box>
              <Button color="inherit" disableRipple onClick={() => setOpen(!open)}>
                Hall of Fame
              </Button>
            </Box>
          </Container>
        </Box>
      </div>
      <HallOfFame open={open} setOpen={setOpen} />
    </>
  );
};

export default Footer;
