import { Dialog, DialogTitle, Typography, IconButton, DialogContent, makeStyles, Grid, Box } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const rubberdokMembers: {
  [year: string]: {
    name: string;
    class: number;
    position?: string;
  }[];
} = {
  "2021/2022": [
    { name: "Lars Waage", class: 4, position: "Prosjektleder" },
    { name: "Hermann Mørkrid", class: 4, position: "Prosjektleder" },
    { name: "Morgan Heggland", class: 5 },
    { name: "Jorunn Leithe", class: 4 },
    { name: "Jørgen Rosager", class: 4 },
    { name: "Mathilde Marie Solberg", class: 4 },
    { name: "Erik Thinn Tvedt", class: 3 },
    { name: "Sebastian Cheng", class: 3 },
    { name: "Herman Holmøy", class: 2 },
    { name: "Ragnhild Bodsberg", class: 2 },
    { name: "Johan Haga Mohn", class: 1 },
  ],
  "2020/2021": [
    { name: "Morgan Heggland", class: 4, position: "Prosjektleder" },
    { name: "Lars Lien Ankile", class: 4, position: "Lederpar HS" },
    { name: "Andreas Johannesen", class: 4, position: "Lederpar HS" },
    { name: "Sverre Spetalen", class: 5 },
    { name: "Anna Sofie Lunde", class: 4 },
    { name: "Fredrik Ahlborg", class: 4 },
    { name: "Ingrid Aaseng", class: 4 },
    { name: "Patrik Kjærran", class: 4 },
    { name: "Hermann Mørkrid", class: 3 },
    { name: "Lars Waage", class: 3 },
    { name: "Mathilde Marie Solberg", class: 3 },
    { name: "Herman Holmøy", class: 1 },
    { name: "Mathias Raa", class: 1 },
  ],
};

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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const classes = useStyles();

  return (
    <Dialog maxWidth="xl" fullWidth={false} onClose={() => setOpen(!open)} aria-labelledby="dialogTitle" open={open}>
      <DialogTitle disableTypography>
        <Typography gutterBottom variant="h4" id="dialogTitle">
          Hall of Fame
        </Typography>
        <Typography variant="body1">Progget med blod, svette, tårer og kjærlighet av:</Typography>
        <IconButton className={classes.closeButton} aria-label="close" onClick={() => setOpen(!open)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {Object.entries(rubberdokMembers).map(([year, members]) => (
          <Box key={year}>
            <Typography>{year}</Typography>
            <Grid container>
              {members.map((member) => (
                <Grid item key={member.name}>
                  <Box padding="5px" width="200px">
                    <Typography variant="body2">{member.name}</Typography>
                    <Typography variant="caption">
                      {member.class}. klasse
                      {member.position && ` | ${member.position}`}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default HallOfFame;
