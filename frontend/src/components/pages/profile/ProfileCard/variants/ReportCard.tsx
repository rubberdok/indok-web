import { Grid, Typography } from "@material-ui/core";
import Report from "@public/illustrations/Report.svg";
import ProfileCard from "../base";

const ReportCard: React.VFC = () => {
  return (
    <ProfileCard title="Baksida" actionText="Gå til Baksida" actionLink="/report" image={Report} alt="">
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Har du opplevd noe ugreit, ubehagelig eller ulovlig på Indøk? Da kan du varsle om det.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default ReportCard;
