import { Grid, Typography } from "@material-ui/core";
import Event from "@public/illustrations/Event.svg";
import ProfileCardBase, { ProfileActionProps } from "./ProfileCardBase";
import createLinkProfileAction from "./linkProfileAction";

/** Displays a card on the profile page that links to events to which the user has signed up. */
const EventCard: React.VFC<ProfileActionProps> = (props) => {
  return (
    <ProfileCardBase
      title="Arrangementer"
      Action={createLinkProfileAction({ text: "Se arrangementer", link: "/events" })}
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
