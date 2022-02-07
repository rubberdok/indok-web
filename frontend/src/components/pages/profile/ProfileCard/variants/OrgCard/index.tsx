import { Grid, Typography } from "@material-ui/core";
import OrganizationImg from "@public/illustrations/Organization.svg";
import OrgAction, { Props as OrgListProps } from "./OrgAction";
import BaseCard from "../../BaseCard";

/**
 * Displays a card on the profile page that shows an overview of the organizations
 * that the user is a member of.
 */
const OrgCard: React.VFC<OrgListProps> = ({ orgs, ...props }) => {
  return (
    <BaseCard
      title="Organisasjoner"
      Action={<OrgAction orgs={orgs} {...props} />}
      image={OrganizationImg}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle organisasjoner der du er medlem.</Typography>
        </Grid>
      </Grid>
    </BaseCard>
  );
};

export default OrgCard;
