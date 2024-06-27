import { Button, CardActions, Grid, Typography } from "@mui/material";

import { NextLinkComposed } from "@/app/components/Link";
import { DocumentsIllustration } from "./DocumentsIllustration";
import { ProfileCardBase } from "./ProfileCardBase";

function DocumentsAdminCard() {
  return (
    <>
      <ProfileCardBase
        title="Administrer dokumenter"
        actions={
          <CardActions>
            <Button component={NextLinkComposed} to="/documents/admin" color="secondary">
              Administrer
            </Button>
          </CardActions>
        }
        image={<DocumentsIllustration />}
        alt=""
      >
        <Grid container direction="column">
          <Grid item>
            <Typography variant="body2">Her kan du legge til, endre og slette dokumenter</Typography>
          </Grid>
        </Grid>
      </ProfileCardBase>
    </>
  );
}

export { DocumentsAdminCard };
