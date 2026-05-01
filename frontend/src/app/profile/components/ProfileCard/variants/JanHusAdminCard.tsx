import { Grid, Typography } from "@mui/material";

import Organization from "~/public/illustrations/Organization.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const JanHusAdminCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="JanHus-admin"
      actionText="Administrer JanHus"
      actionLink="/janhus/admin"
      image={Organization}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Administrer forespørsler, bookinger, prisgrunnlag og innstillinger for JanHus.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
