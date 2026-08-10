import { Grid, Typography } from "@mui/material";

import Form from "~/public/illustrations/Form.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const FormCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase title="Verv" actionText="Se verv" actionLink="/listings" image={Form} alt="" {...props}>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">Her kan du se en oversikt over alle åpne søknader på verv.</Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
