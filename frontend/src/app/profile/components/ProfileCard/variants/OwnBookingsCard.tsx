import { Grid, Typography } from "@mui/material";

import Event from "~/public/illustrations/Event.svg";

import { ProfileCardBase } from "./ProfileCardBase";

export const OwnBookingsCard: React.VFC = ({ ...props }) => {
  return (
    <ProfileCardBase
      title="Mine bookinger"
      actionText="Se bookinger"
      actionLink="/booking/own_bookings"
      image={Event}
      alt=""
      {...props}
    >
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2">
            Se JanHus- og hyttebookinger samlet, og betal JanHus-bookinger med Vipps når betaling er tilgjengelig.
          </Typography>
        </Grid>
      </Grid>
    </ProfileCardBase>
  );
};
