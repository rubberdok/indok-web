import Calendar from "@components/Calendar";
import useDisabledDates from "@hooks/cabins/useDisabledDates";
import { Cabin } from "@interfaces/cabins";
import { Grid, Typography, Divider, makeStyles } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";

const useStyles = makeStyles({
  header: {
    display: "inline",
  },
});

interface Props {
  chosenCabins: Cabin[];
}

const CabinDatePicker: NextPage<Props> = ({ chosenCabins }) => {
  const classes = useStyles();
  const [checkInDate, setCheckInDate] = useState<string>();
  const [checkOutDate, setCheckOutDate] = useState<string>();
  const { disabledDates: checkInDisabledDates, setDisabledDates: setCheckInDisabledDates } = useDisabledDates(
    chosenCabins
  );
  const { disabledDates: checkOutDisabledDates, setDisabledDates: setCheckOutDisabledDates } = useDisabledDates(
    chosenCabins
  );
  const getHeader = (header: string, isFrom: boolean) => (
    <Grid item>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Typography className={classes.header} variant="body1">
        {getSubheader(isFrom)}
      </Typography>
      <Divider />
    </Grid>
  );

  const getSubheader = (isFrom: boolean) => {
    if (chosenCabins.length === 1) {
      return ` ${isFrom ? "fra" : "til"} ${chosenCabins[0].name}`;
    } else {
      return ` ${isFrom ? "fra" : "til"} ${chosenCabins[0].name} og ${chosenCabins[1].name}`;
    }
  };
  return (
    <Grid container spacing={5}>
      <Grid item xs container direction="column" spacing={3}>
        {getHeader("Innsjekk", false)}
        <Grid item xs>
          <Calendar disabledDates={checkInDisabledDates} handleDateClicked={(date) => setCheckInDate(date)} />
        </Grid>
      </Grid>
      <Grid item xs container direction="column" spacing={3}>
        {getHeader("Utsjekk", true)}
        <Grid item xs>
          <Calendar disabledDates={checkOutDisabledDates} handleDateClicked={(date) => setCheckOutDate(date)} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CabinDatePicker;
