import { Button, Grid, Typography } from "@material-ui/core";
import ProfileCard from "..";
import Organization from "../../../../../../public/Event.svg";

const OrganizationCard: React.VFC = () => {
  return (
    <ProfileCard
      title="Organisasjoner"
      cardActions={
        <Grid container direction="row" justifyContent="flex-end">
          <Grid item>
            <Button>Se organisasjoner</Button>
          </Grid>
        </Grid>
      }
      image={Organization}
      alt=""
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle organisasjoner der du er medlem.</Typography>
        </Grid>
      </Grid>
    </ProfileCard>
  );
};

export default OrganizationCard;
