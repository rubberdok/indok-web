import { Button, Grid, Typography } from "@material-ui/core";
import Event from "@public/illustrations/Event.svg";
import ProfileCard from "..";

const EventCard: React.VFC = () => {
  return (
    <ProfileCard
      title="Arrangementer"
      cardActions={
        <Grid container direction="row" justifyContent="flex-end">
          <Grid item>
            <Button>Se arrangementer</Button>
          </Grid>
        </Grid>
      }
      image={Event}
      alt=""
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Her kan du se en oversikt over alle arrangementer du har vært påmeldt.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default EventCard;
