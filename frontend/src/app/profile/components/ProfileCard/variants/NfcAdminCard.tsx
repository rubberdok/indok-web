import { Grid, Typography } from "@mui/material";

import Bug from "~/public/illustrations/Bug.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const NfcAdminCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="NFC-kort"
      actionText="Gå til NFC-kort og adgang"
      actionLink="/admin-edit/nfc"
      image={Bug}
      alt="Admin illustration"
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du administrere NFC-kort, PIN og adgang til JanHus.</Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
