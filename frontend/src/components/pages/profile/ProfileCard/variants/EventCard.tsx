import { Grid, Typography } from "@material-ui/core";
import Event from "@public/illustrations/Event.svg";
import ProfileCard from "../base";

const EventCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCard
      title="Arrangementer"
      actionText="Se arrangementer"
      actionLink="/events"
      image={Event}
      alt=""
      {...props}
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
