import { Grid, Typography } from "@mui/material";

import Organization from "~/public/illustrations/Organization.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const OrganizationCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Foreninger"
      actionText="Se foreninger"
      actionLink="/profile/organizations"
      image={Organization}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle foreninger der du er medlem.</Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
