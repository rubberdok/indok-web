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
  },
  rdLogo: {
    height: "100%",
    float: "left",
    marginRight: theme.spacing(4),

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
              <Grid item xs={6}>
                <Link href="/" passHref>
                  <Typography variant="h5" className={classes.title} gutterBottom>
                    INDØK
                  </Typography>
                </Link>
                <Typography variant="caption">
                  Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU
                </Typography>
                <br />
                <Typography variant="caption">Kolbjørn Hejes vei 1E, 7034 Trondheim</Typography>
                <br />
                <Typography variant="caption">Org.nr. 994 778 463</Typography>
                <br />
                <a href="mailto:Leder@indokhs.no">
                  <Typography variant="caption" gutterBottom>
                    Leder@indokhs.no
                  </Typography>
                </a>
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
              <Grid item xs={6}>
                <Box className={classes.nth} position="absolute" width="600px" height="100%" top={0} zIndex={-1}></Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Box className={classes.credits}>
          <Container>
            <Box height="100%" display="flex" alignItems="center">
              <a href="https://github.com/hovedstyret/indok-web" rel="noreferrer noopener" style={{ height: "100%" }}>
                <img className={classes.rdLogo} src="/rd-logo.svg" alt="Rubberdøk logo" />
              </a>
              <Box flexGrow="1">
                <Typography variant="caption">
                  Forslag til nettsiden eller oppdaget en feil? Lag en issue på{" "}
                  <a href="https://github.com/hovedstyret/indok-web/issues">GitHub</a>, eller send mail til{" "}
                  <a href="mailto:web@indokhs.no">web@indokhs.no</a>.
                </Typography>
                <br />
                <Typography variant="caption">
                  Utviklet av{" "}
                  <a href="https://github.com/hovedstyret/indok-web" rel="norefferer noopener">
                    RubberDøk
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
                    <Typography variant="caption">Lederpar Hovedstyret</Typography>
                  </TableCell>
                  <TableCell>
                    Andreas Johannesen &apos;22
                    <br />
                    <Typography variant="caption">Lederpar Hovedstyret</Typography>
                  </TableCell>
                  <TableCell>
                    Ingrid Aaseng &apos;22
                    <br />
                    <Typography variant="caption">Arkiv</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Fredrik Ahlborg &apos;22
                    <br />
                    <Typography variant="caption">Content Creator</Typography>
                  </TableCell>
                  <TableCell>
                    Herman Holmøy &apos;25
                    <br />
                    <Typography variant="caption">Hyttebooking </Typography>
                  </TableCell>
                  <TableCell>
                    Patrik Kjærran &apos;22
                    <br />
                    <Typography variant="caption">Event</Typography>
                  </TableCell>
                  <TableCell>
                    Anna Sofie Lunde &apos;22
                    <br />
                    <Typography variant="caption">Arkiv</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Hermann Mørkrid &apos;23
                    <br />
                    <Typography variant="caption">Verv-søking</Typography>
                  </TableCell>
                  <TableCell>
                    Mathias Raa &apos;25
                    <br />
                    <Typography variant="caption">Chief of Design</Typography>
                  </TableCell>
                  <TableCell>
                    Mathilde Marie Solberg &apos;23
                    <br />
                    <Typography variant="caption">Event</Typography>
                  </TableCell>
                  <TableCell>
                    Sverre Spetalen &apos;21
                    <br />
                    <Typography variant="caption">Hyttebooking</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Lars Waage &apos;23
                    <br />
                    <Typography variant="caption">Verv-søking</Typography>
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
