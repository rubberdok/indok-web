import { Grid, Typography } from "@material-ui/core";
import Event from "@public/illustrations/Event.svg";
import LinkAction from "./actions/LinkAction";
import ProfileCardBase from "./ProfileCardBase";

/** Displays a card on the profile page that links to events to which the user has signed up. */
const EventCard: React.VFC = (props) => {
  return (
    <ProfileCardBase
      title="Arrangementer"
      Action={<LinkAction text="Se arrangementer" link="/events" />}
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
