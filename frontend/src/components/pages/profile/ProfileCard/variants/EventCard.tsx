import { Grid, Typography } from "@mui/material";
import Event from "@public/illustrations/Event.svg";
import ProfileCardBase from "./ProfileCardBase";

const EventCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
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
    </ProfileCardBase>
  );
};

export default EventCard;
