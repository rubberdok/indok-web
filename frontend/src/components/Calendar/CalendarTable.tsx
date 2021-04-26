import dayjs from "dayjs";
import React from "react";
import { DAYS_IN_WEEK } from "./constants";
import { Grid, makeStyles, Typography } from "@material-ui/core";

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
  backButton?: () => React.ReactNode;
  nextButton?: () => React.ReactNode;
}

const CalendarTable: React.FC<Props> = ({ getRows, month, backButton, nextButton }) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item container justify={backButton && nextButton ? "space-between" : "center"}>
        {backButton ? <Grid item>{backButton()}</Grid> : null}
        <Typography variant="body1" align="center">{`${month.format("MMMM")} - ${month.format("YYYY")}`}</Typography>
        {nextButton ? <Grid item>{nextButton()}</Grid> : null}
      </Grid>
      <Grid item component="table" className={classes.table}>
        <Grid container component="thead">
          <Grid item container xs component="tr">
            {DAYS_IN_WEEK.map((dow: string) => (
              <Grid item xs component="th" key={dow} className={classes.weekday}>
                {dow}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid container component="tbody" direction="column">
          {getRows(month).map((row, index) => (
            <Grid item container xs component="tr" key={`row-${index}`} wrap="nowrap">
              {row}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CalendarTable;
