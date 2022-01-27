import { Grid, Typography } from "@material-ui/core";
import OrganizationImg from "@public/illustrations/Organization.svg";
import ProfileCardBase from "../ProfileCardBase";
import { IntegrationTestProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";
import OrgAction, { Props as OrgListProps } from "./OrgAction";

const OrgCard: React.VFC<OrgListProps & IntegrationTestProps> = ({ orgs, ...props }) => {
  return (
    <ProfileCardBase
      title="Organisasjoner"
      actionText="Se organisasjoner"
      actionLink="/orgs"
      image={OrganizationImg}
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

export default OrgCard;
