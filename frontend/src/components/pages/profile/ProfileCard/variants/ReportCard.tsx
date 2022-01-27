import { Grid, Typography } from "@material-ui/core";
import Report from "@public/illustrations/Report.svg";
import ProfileCardBase, { IntegrationTestProps } from "./ProfileCardBase";

const ReportCard: React.VFC<IntegrationTestProps> = (props) => {
  return (
    <ProfileCardBase title="Baksida" actionText="Gå til Baksida" actionLink="/report" image={Report} alt="" {...props}>
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
