import { Grid, Typography } from "@material-ui/core";
import Event from "@public/illustrations/Event.svg";
import ProfileCardBase, { IntegrationTestProps } from "./ProfileCardBase";

const EventCard: React.VFC<IntegrationTestProps> = (props) => {
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
