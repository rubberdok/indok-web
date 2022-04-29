import { Grid, Typography } from "@mui/material";
import Cabin from "@public/illustrations/Cabin.svg";
import ProfileCardBase from "./ProfileCardBase";

const CabinsAdminCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Hytte-admin"
      actionText="Administrer indøkhyttene"
      actionLink="/cabins/admin"
      image={Cabin}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Her kan du administrere bookingsøknader og stille inn bookingsemestre.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};

export default CabinsAdminCard;
