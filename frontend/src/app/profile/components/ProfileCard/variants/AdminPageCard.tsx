import { Grid, Typography } from "@mui/material";

import Bug from "~/public/illustrations/Bug.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const AdminPageCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Brukeradministrasjon"
      actionText="Gå til brukeradministrasjon"
      actionLink="/admin-edit"
      image={Bug}
      alt="Admin illustration"
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du administrere brukerinformasjon og NFC-kort informasjon.</Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};