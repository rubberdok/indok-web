import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Close, Facebook, GitHub } from "@material-ui/icons";
import Link from "next/link";
import React from "react";
import rubberdokLogo from "@public/rubberdok_logo.svg";
import Image from "next/image";

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
    [theme.breakpoints.down("sm")]: {
      height: "unset",
      flexDirection: "column",
    },
  },
  creditsContent: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },

    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  table: {
    minWidth: 800,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  title: {
    color: "#fff",

    "&:hover": {
      cursor: "pointer",
    },
  },
  nth: {
    background: "url('/nth.svg')",
    backgroundSize: 500,
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    opacity: 0.25,

    [theme.breakpoints.down("md")]: {
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
                <a href="mailto:Leder@indokhs.no">
                  <Typography variant="body2">Leder@indokhs.no</Typography>
                </a>
                <Link href="/report/">Baksida</Link>
                <Box mt={2}>
                  <a href="https://www.facebook.com/HovedstyretIndok" rel="noreferrer noopener" target="_blank">
                    <IconButton edge="start" size="small" aria-label="facebook" color="inherit">
                      <Facebook />
                    </IconButton>
                  </a>
                  <a href="https://github.com/hovedstyret/indok-web" rel="noreferrer noopener" target="_blank">
                    <IconButton size="small" aria-label="github" color="inherit">
                      <GitHub />
                    </IconButton>
                  </a>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={classes.nth} position="absolute" width="600px" height="100%" top={0} zIndex={-1}></Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Box className={classes.credits}>
          <Container>
            <Box height="100%" display="flex" alignItems="center" className={classes.creditsContent}>
              <a href="https://github.com/hovedstyret/indok-web" rel="noreferrer noopener" style={{ height: "100%" }}>
                <img className={classes.rdLogo} src="/img/rubberdok_logo_white.svg" alt="Rubberdøk logo" />
              </a>
              <Box flexGrow="1">
                <Typography variant="body2">
                  Forslag til nettsiden eller oppdaget en feil? Lag et issue på{" "}
                  <a href="https://github.com/hovedstyret/indok-web/issues">GitHub</a>, eller send mail til{" "}
                  <a href="mailto:feedback@rubberdok.no">feedback@rubberdok.no</a>.
                </Typography>
                <Typography variant="body2">
                  Utviklet av{" "}
                  <a href="https://github.com/hovedstyret/indok-web" rel="norefferer noopener">
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
      <Dialog
        maxWidth="xl"
        fullWidth={false}
        onClose={() => setOpen(!open)}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle disableTypography>
          <Typography gutterBottom variant="h4">
            Hall of Fame 2020/2021
          </Typography>
          <Typography variant="body1">Progget med blod, svette, tårer og kjærlighet av</Typography>
          <IconButton className={classes.closeButton} aria-label="close" onClick={() => setOpen(!open)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    Morgan Heggland &apos;22
                    <br />
                    <Typography variant="caption">Big Boss Morgan</Typography>
                  </TableCell>
                  <TableCell>
                    Lars Lien Ankile &apos;22
                    <br />
                    <Typography variant="caption">LP &amp; Chief Devops Architect</Typography>
                  </TableCell>
                  <TableCell>
                    Andreas Johannesen &apos;22
                    <br />
                    <Typography variant="caption">LP &amp; Chief Visionary</Typography>
                  </TableCell>
                  <TableCell>
                    Ingrid Aaseng &apos;22
                    <br />
                    <Typography variant="caption">Head of Archive Solutions</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Fredrik Ahlborg &apos;22
                    <br />
                    <Typography variant="caption">Content Creator &amp; Social Chair</Typography>
                  </TableCell>
                  <TableCell>
                    Herman Holmøy &apos;25
                    <br />
                    <Typography variant="caption">Cabin Management System</Typography>
                  </TableCell>
                  <TableCell>
                    Patrik Kjærran &apos;22
                    <br />
                    <Typography variant="caption">Event Backend Strategist</Typography>
                  </TableCell>
                  <TableCell>
                    Anna Sofie Lunde &apos;22
                    <br />
                    <Typography variant="caption">Head of Archive Solutions</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Hermann Mørkrid &apos;23
                    <br />
                    <Typography variant="caption">Head of Extracurricular System</Typography>
                  </TableCell>
                  <TableCell>
                    Mathias Raa &apos;25
                    <br />
                    <Typography variant="caption">Art Director &amp; UX Architect</Typography>
                  </TableCell>
                  <TableCell>
                    Mathilde Marie Solberg &apos;23
                    <br />
                    <Typography variant="caption">Global Head of Event</Typography>
                  </TableCell>
                  <TableCell>
                    Sverre Spetalen &apos;21
                    <br />
                    <Typography variant="caption">Cabin Management System</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Lars Waage &apos;23
                    <br />
                    <Typography variant="caption">Head of Extracurricular System</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
