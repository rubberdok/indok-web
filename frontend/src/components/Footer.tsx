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
import CloseIcon from "@material-ui/icons/Close";
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
    height: 88,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
                  Foreningen for studentene ved Industriell Økonomi og Teknologiledelse, NTNU
                </Typography>
                <br />
                <Typography variant="caption">Kolbjørn Hejes vei 1E, 7034 Trondheim</Typography>
                <br />
                <Typography variant="caption">Org.nr. 994 778 463</Typography>
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
              <img className={classes.rdLogo} src="/rd-logo.svg" alt="Rubberdøk logo" />
              <Box flexGrow="1">
                <Typography variant="caption">
                  Utviklet av{" "}
                  <a href="https://github.com/hovedstyret/indok-web" rel="norefferer noopener">
                    RubberDøk
                  </a>
                  , Hovedstyrets Webkomité. Kopirett © 2020 Foreningen for studentene ved Indøk. Alle rettigheter
                  reservert
                </Typography>
              </Box>
              <Button color="inherit" onClick={() => setOpen(!open)}>
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
          <Typography variant="body1">Laget med blod, svette, tårer og kjærlighet av</Typography>
          <IconButton className={classes.closeButton} aria-label="close" onClick={() => setOpen(!open)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <p>Morgan Heggland &apos;22</p> <p>(prosjektleder)</p>
                  </TableCell>
                  <TableCell>
                    <p>Lars Lien Ankile &apos;22</p> <p>(Lederpar Hovedstyret)</p>
                  </TableCell>
                  <TableCell>
                    <p>Andreas Johannesen &apos;22</p> <p>(Lederpar Hovedstyret)</p>
                  </TableCell>
                  <TableCell>Ingrid Aaseng &apos;22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Herman Holmøy &apos;25</TableCell>
                  <TableCell>Fredrik Ahlborg &apos;22</TableCell>
                  <TableCell>Patrik Kjærran &apos;22</TableCell>
                  <TableCell>Anna Sofie Lunde &apos;22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hermann Mørkrid &apos;23</TableCell>
                  <TableCell>Mathias Raa &apos;25</TableCell>
                  <TableCell>Mathilde Marie Solberg &apos;23</TableCell>
                  <TableCell>Sverre Spetalen &apos;21</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lars Waage &apos;23</TableCell>
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
