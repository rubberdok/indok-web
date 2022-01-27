import { Grid, Typography } from "@material-ui/core";
import Organization from "@public/illustrations/Organization.svg";
import ProfileCardBase from "../ProfileCardBase";

const OrganizationCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Organisasjoner"
      actionText="Se organisasjoner"
      actionLink="/orgs"
      image={Organization}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle organisasjoner der du er medlem.</Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};

export default OrganizationCard;
