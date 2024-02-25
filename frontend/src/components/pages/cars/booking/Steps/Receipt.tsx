import { Divider, Grid, Typography } from "@mui/material";

import { CarBookingStatus } from "./CarStatus";
import { ContactInfo } from "./ContactInfo";

import { BookingProductFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Props = {
  chosenCars: BookingProductFragment[];
  contactInfo: ContactInfo | undefined;
  mailSent?: boolean;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
};

/** Step in the cars/book site. Shows a confirmation of the booking made after the payment site. */
export const ReceiptSite: React.FC<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <Typography variant="h3">Takk for din bestilling</Typography>
        <Divider />
      </Grid>

      <Grid item container justifyContent="space-evenly" alignItems="stretch">
        <Grid item>
          <CarBookingStatus carText="Du har nå søkt om å booke" {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};
