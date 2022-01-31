import { Grid, Typography } from "@material-ui/core";
import OrganizationImg from "@public/illustrations/Organization.svg";
import ProfileCardBase from "../ProfileCardBase";
import { ProfileActionProps } from "@components/pages/profile/ProfileCard/variants/ProfileCardBase";
import { createOrgProfileAction, Props as OrgListProps } from "./OrgAction";

/**
 * Displays a card on the profile page that shows an overview of the organizations
 * of which the user is a member.
 */
const OrgCard: React.VFC<OrgListProps & ProfileActionProps> = ({ orgs, ...props }) => {
  return (
    <ProfileCardBase
      title="Organisasjoner"
      Action={createOrgProfileAction({ orgs })}
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
