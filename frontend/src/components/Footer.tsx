import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: theme.spacing(15),
    marginBottom: theme.spacing(2),
  },
  nth: {
    opacity: 0.035,
    width: "500px",
    right: "-120px",
    bottom: "-120px",
    position: "absolute",
    zIndex: -100,
  },
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
    marginLeft: 40,
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box mt={10} className={classes.credits}>
        <Container>
          <Button variant="contained" onClick={handleClickOpen}>
            Hall of Fame
          </Button>
          <Typography className={classes.text} variant="caption">
            Under konstruksjon av{" "}
            <Link color="inherit" target="_blank" href="https://github.com/hovedstyret/indok-web">
              RubberDøk
            </Link>
            , Hovedstyret på Indøk sin webkomité. Kopirett © 2021 Foreningen for studentene ved Indøk. Alle rettigheter
            reservert.
          </Typography>
        </Container>
      </Box>
      <Dialog
        maxWidth="xl"
        fullWidth={false}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle disableTypography>
          <Typography gutterBottom variant="h4">
            Hall of Fame 2020/2021
          </Typography>
          <Typography variant="body1">Laget med blod, svette, tårer og kjærlighet av</Typography>
          <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
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
