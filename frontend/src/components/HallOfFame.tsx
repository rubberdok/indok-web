import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  DialogContent,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  table: {
    minWidth: 800,
  },
}));

const HallOfFame: React.VFC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="xl"
      fullWidth={false}
      onClose={() => setOpen(!open)}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle disableTypography>
        <Typography gutterBottom variant="h4">
          Hall of Fame
        </Typography>
        <Typography variant="body1">Progget med blod, svette, tårer og kjærlighet av:</Typography>
        <IconButton className={classes.closeButton} aria-label="close" onClick={() => setOpen(!open)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>2021/2022</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell>
                  Lars Waage &apos;23
                  <br />
                  <Typography variant="caption">Prosjektleder</Typography>
                </TableCell>
                <TableCell>
                  Hermann Mørkrid &apos;23
                  <br />
                  <Typography variant="caption">Prosjektleder</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Morgan Heggland &apos;22</TableCell>
                <TableCell>Jorunn Leithe &apos;23</TableCell>
                <TableCell>Jørgen Rosager &apos;23</TableCell>
                <TableCell>Mathilde Marie Solberg &apos;23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Erik Thinn Tvedt &apos;24</TableCell>
                <TableCell>Sebastian Cheng &apos;24</TableCell>
                <TableCell>Herman Holmøy &apos;25</TableCell>
                <TableCell>Ragnhild Bodsberg &apos;25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Johan Haga Mohn &apos;26</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Typography>2020/2021</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell>Morgan Heggland &apos;22</TableCell>
                <TableCell>Lars Lien Ankile &apos;22</TableCell>
                <TableCell>Andreas Johannesen &apos;22</TableCell>
                <TableCell>Ingrid Aaseng &apos;22</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fredrik Ahlborg &apos;22</TableCell>
                <TableCell>Herman Holmøy &apos;25</TableCell>
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
  );
};

export default HallOfFame;
