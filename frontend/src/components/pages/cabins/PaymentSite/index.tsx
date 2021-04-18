import { NextPage } from "next";
import { Grid, Typography, Divider } from "@material-ui/core";
import { Cabin, ContactInfo } from "@interfaces/cabins";
import { DatePick } from "src/pages/cabins/book";
import CabinBookingStatus from "../CabinBookingStatus";

interface Props {
  chosenCabins: Cabin[];
  datePick: DatePick;
  contactInfo: ContactInfo;
}

const PaymentSite: NextPage<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column" spacing={5}>
      <Grid item>
        <Typography variant="h4">Se igjennom og betal</Typography>
        <Divider />
      </Grid>
      <Grid item container justify="space-evenly" alignItems="stretch">
        <Grid item>
          <CabinBookingStatus {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymentSite;
