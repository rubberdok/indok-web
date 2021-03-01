import Calendar from "@components/Calendar";
import useDisabledDates from "@hooks/cabins/useDisabledDates";
import { Cabin } from "@interfaces/cabins";
import { Grid, Typography, Divider, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const useStyles = makeStyles({
  header: {
    display: "inline",
  },
});

interface Props {
  chosenCabins: Cabin[];
}

interface DatePick {
  checkInDate?: string;
  checkOutDate?: string;
}

const CabinDatePicker: NextPage<Props> = ({ chosenCabins }) => {
  const classes = useStyles();
  const [datePick, setDatePick] = useState<DatePick>({});
  const { disabledDates } = useDisabledDates(chosenCabins);
  const [disableAfter, setDisableAfter] = useState<string>();
  const getHeader = (header: string, prefix: string) => (
    <Grid item>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Typography className={classes.header} variant="body1">
        {getSubheader(prefix)}
      </Typography>
      <Divider />
    </Grid>
  );

  useEffect(() => {
    if (datePick.checkInDate) {
      // Find next booking and diable all dates after that booking starts
      const startDate = dayjs(datePick.checkInDate);
      setDisableAfter(disabledDates.find((date: string) => startDate.isBefore(dayjs(date))));
    }
  }, [datePick]);

  const getSubheader = (prefix: string) => {
    if (chosenCabins.length === 1) {
      return ` ${prefix} ${chosenCabins[0].name}`;
    } else {
      return ` ${prefix} ${chosenCabins[0].name} og ${chosenCabins[1].name}`;
    }
  };
  return (
    <Grid container spacing={5}>
      <Grid item xs container direction="column" spacing={3}>
        {getHeader("Innsjekk", "til")}
        <Grid item xs>
          <Calendar
            disabledDates={disabledDates}
            handleDateClicked={(date) => setDatePick((prev: DatePick) => ({ ...prev, checkInDate: date }))}
            disableAfter={datePick.checkOutDate}
          />
        </Grid>
      </Grid>
      <Grid item xs container direction="column" spacing={3}>
        {getHeader("Utsjekk", "fra")}
        <Grid item xs>
          <Calendar
            disabledDates={disabledDates}
            handleDateClicked={(date) => setDatePick((prev: DatePick) => ({ ...prev, checkOutDate: date }))}
            disableBefore={datePick.checkInDate}
            disableAfter={disableAfter}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CabinDatePicker;
