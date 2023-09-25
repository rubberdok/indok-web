import { Divider, Grid, Hidden, Typography } from "@mui/material";

import { CabinFragment } from "@/generated/graphql";
import { ContactInfo, DatePick } from "@/types/cabins";

import { CabinBookingStatus } from "../CarBookingStatus";

type Props = {
  chosenCabins: CabinFragment[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  mailSent?: boolean;
};

/** Step in the cabins/book site. Shows a confirmation of the booking made after the payment site. */
export const ReceiptSite: React.FC<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column">
      <Hidden lgDown>
        <Grid item>
          <Typography variant="h4">Takk for din bestilling</Typography>
          <Divider />
        </Grid>
      </Hidden>

      <Grid item container justifyContent="space-evenly" alignItems="stretch">
        <Grid item>
          <CabinBookingStatus cabinText="Du har nå søkt om å booke" {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};
