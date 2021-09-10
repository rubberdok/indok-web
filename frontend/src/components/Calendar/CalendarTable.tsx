import dayjs from "dayjs";
import React from "react";
import { DAYS_IN_WEEK } from "./constants";
import { Grid, Hidden, IconButton, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

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
  onChangeMonth: (months: number) => void;
}

const CalendarTable: React.FC<Props> = ({ getRows, month, onChangeMonth }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid container>
      <Grid item container alignItems="center" justifyContent={isMobile ? "space-between" : "center"}>
        <Hidden mdUp>
          <IconButton onClick={() => onChangeMonth(-1)}>
            <NavigateBeforeIcon />
          </IconButton>
        </Hidden>
        <Typography variant="body1" align="center">{`${month.format("MMMM")} - ${month.format("YYYY")}`}</Typography>
        <Hidden mdUp>
          <IconButton onClick={() => onChangeMonth(1)}>
            <NavigateNextIcon />
          </IconButton>
        </Hidden>
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
