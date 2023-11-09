import { Divider, Grid, Typography } from "@mui/material";

import { CabinFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

import { CabinBookingStatus } from "./CabinStatus";
import { ContactInfo } from "./ContactInfo";

type Props = {
  chosenCabins: CabinFragment[];
  contactInfo: ContactInfo | undefined;
  mailSent?: boolean;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
};

/** Step in the cabins/book site. Shows a confirmation of the booking made after the payment site. */
export const ReceiptSite: React.FC<Props> = (props) => {
  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <Typography variant="h3">Takk for din bestilling</Typography>
        <Divider />
      </Grid>

      <Grid item container justifyContent="space-evenly" alignItems="stretch">
        <Grid item>
          <CabinBookingStatus cabinText="Du har nå søkt om å booke" {...props} />
        </Grid>
      </Grid>
    </Grid>
  );
};
