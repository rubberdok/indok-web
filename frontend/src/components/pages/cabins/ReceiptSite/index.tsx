import { NextPage } from "next";
import { Grid, Typography, Divider, Hidden } from "@mui/material";
import { Cabin, ContactInfo, DatePick } from "@interfaces/cabins";
import CabinBookingStatus from "../CabinBookingStatus";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  mailSent?: boolean;
}

/*
Step in the cabins/book site. Shows a confirmation of the booking made after the payment site.
*/
const ReceiptSite: NextPage<Props> = (props) => {
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

export default ReceiptSite;
