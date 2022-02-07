import { Grid, Typography } from "@material-ui/core";
import Report from "@public/illustrations/Report.svg";
import LinkAction from "./actions/LinkAction";
import ProfileCardBase from "./ProfileCardBase";

/** Displays a card on the profile page that links to the Reports page. */
const ReportCard: React.VFC = (props) => {
  return (
    <ProfileCardBase
      title="Baksida"
      Action={<LinkAction text="Gå til Baksida" link="/report" {...props} />}
      image={Report}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Har du opplevd noe ugreit, ubehagelig eller ulovlig på Indøk? Da kan du varsle om det.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};

export default ReportCard;
