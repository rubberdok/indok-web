import { Grid, Typography } from "@mui/material";

import Report from "~/public/illustrations/Report.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const ReportCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase title="Baksida" actionText="Gå til Baksida" actionLink="/baksida" image={Report} alt="" {...props}>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Har du opplevd noe ugreit eller ubehagelig på Indøk? Da kan du melde fra om det til Baksida.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
