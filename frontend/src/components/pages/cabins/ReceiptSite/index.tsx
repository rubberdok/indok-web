import { NextPage } from "next";
import { Grid, Typography, Divider, useTheme, useMediaQuery } from "@material-ui/core";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid container alignItems="center" direction="column">
      {isMobile ? null : (
        <Grid item>
          <Typography variant="h4">Takk for din bestilling</Typography>
          <Divider />
        </Grid>
      )}

      <Grid item container justify="space-evenly" alignItems="stretch">
        <Grid item>
          <CabinBookingStatus cabinText="Du har nå søkt om å booke" {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReceiptSite;
