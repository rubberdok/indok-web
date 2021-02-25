import dayjs from "dayjs";
import React from "react";
import { DAYS_IN_WEEK } from "./constants";
import { Box, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  table: {
    width: "100%",
  },
  weekday: {
    color: "#121414",
    textTransform: "uppercase",
    fontSize: 12,
  },
}));

interface Props {
  getRows: (month: dayjs.Dayjs) => React.ReactNode[];
  month: dayjs.Dayjs;
}

const CalendarTable: React.FC<Props> = ({ getRows, month }) => {
  const classes = useStyles();
  return (
    <Box component="table" className={classes.table}>
      <Grid container component="thead">
        <Grid item container xs component="tr">
          {DAYS_IN_WEEK.map((dow) => (
            <Grid item xs component="th" key={dow} className={classes.weekday}>
              {dow}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid container component="tbody" direction="column">
        {getRows(month).map((row, index) => (
          <Grid item container xs component="tr" key={`row-${index}`}>
            {row}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default CalendarTable;
