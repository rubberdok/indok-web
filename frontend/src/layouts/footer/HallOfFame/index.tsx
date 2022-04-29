import { Close } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, styled, Typography } from "@mui/material";
import { rubberdokMembers } from "src/layouts/footer/HallOfFame/constants";

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HallOfFame: React.FC<Props> = ({ open, setOpen }) => {
  return (
    <Dialog maxWidth="xl" fullWidth={false} onClose={() => setOpen(!open)} aria-labelledby="dialogTitle" open={open}>
      <DialogTitle>
        <Typography gutterBottom variant="h4" id="dialogTitle">
          Hall of Fame
        </Typography>
        <Typography variant="body1">Progget med blod, svette, tårer og kjærlighet av:</Typography>
        <CloseButton aria-label="close" onClick={() => setOpen(!open)} size="large">
          <Close />
        </CloseButton>
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
