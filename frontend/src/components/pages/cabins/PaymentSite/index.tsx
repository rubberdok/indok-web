import { NextPage } from "next";
import { Grid, Typography, Divider, Hidden } from "@mui/material";
import { Cabin, ContactInfo, DatePick } from "@interfaces/cabins";
import CabinBookingStatus from "../CabinBookingStatus";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
}
/*
One of the steps in the cabins/book page. 
The page shows the a description of the current booking and a button to confirm the booking.
*/
const PaymentSite: NextPage<Props> = (props) => {
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

export default PaymentSite;
