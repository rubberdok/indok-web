import { Grid, Typography } from "@material-ui/core";
import Report from "@public/illustrations/Report.svg";
import LinkAction from "../LinkAction";
import BaseCard from "../BaseCard";

/** Displays a card on the profile page that links to the Reports page. */
const ReportCard: React.VFC = (props) => {
  return (
    <BaseCard
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
    </BaseCard>
  );
};

export default ReportCard;
