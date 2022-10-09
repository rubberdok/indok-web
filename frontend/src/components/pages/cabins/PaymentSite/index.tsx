import { Divider, Grid, Hidden, Typography } from "@mui/material";

import { CabinFragment } from "@/generated/graphql";
import { ContactInfo, DatePick } from "@/types/cabins";

import { CabinBookingStatus } from "../CabinBookingStatus";

type Props = {
  chosenCabins: CabinFragment[];
  datePick: DatePick;
  contactInfo: ContactInfo;
};

/**
 * One of the steps in the cabins/book page.
 * The page shows the a description of the current booking and a button to confirm the booking.
 */
export const PaymentSite: React.FC<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column" spacing={5}>
      <Hidden lgDown>
        <Grid item>
          <Typography variant="h4">Se igjennom og send søknad</Typography>
          <Divider />
        </Grid>
      </Hidden>

      <Grid item container justifyContent="space-evenly" alignItems="stretch">
        <Grid item>
          <CabinBookingStatus {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};
