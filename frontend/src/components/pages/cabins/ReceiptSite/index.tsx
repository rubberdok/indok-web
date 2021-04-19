import { NextPage } from "next";
import { Grid, Typography, Divider } from "@material-ui/core";
import { Cabin, ContactInfo } from "@interfaces/cabins";
import { DatePick } from "src/pages/cabins/book";
import CabinBookingStatus from "../CabinBookingStatus";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
  mailSent?: boolean;
}

const ReceiptSite: NextPage<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column" spacing={5}>
      <Grid item>
        <Typography variant="h4">Takk for din bestilling</Typography>
        <Divider />
      </Grid>
      <Grid item container justify="space-evenly" alignItems="stretch">
        <Grid item xs>
          <CabinBookingStatus cabinText="Du har nå søkt om å booke" {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReceiptSite;
