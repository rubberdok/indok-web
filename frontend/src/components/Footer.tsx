import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import React from "react";

const useStyles = makeStyles((theme) => ({
  credits: {
    padding: "30px 0",
    color: "#fff",
    background: "#000",
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
  text: {
    position: "absolute",
    marginLeft: 40,
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Box className={classes.credits}>
        <Box margin="0 auto" maxWidth="90vw">
          <Button variant="contained" onClick={() => setOpen(!open)}>
            Hall of Fame
          </Button>
          <Typography className={classes.text} variant="caption">
            Under konstruksjon av{" "}
            <a href="https://github.com/hovedstyret/indok-web" rel="noreferrer" target="_blank">
              RubberDøk
            </a>
            , Hovedstyret på Indøk sin webkomité. <br />
            Kopirett © 2021 Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse. Alle rettigheter
            reservert.
          </Typography>
        </Box>
      </Box>
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
