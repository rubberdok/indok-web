import dayjs from "dayjs";
import React, { ReactElement } from "react";
import { DAYS_IN_WEEK } from "./constants";
import { Grid, Hidden, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

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
  month: dayjs.Dayjs;
  onChangeMonth: (months: number) => void;
  children?: ReactElement | ReactElement[];
}

const CalendarTable: React.FC<Props> = ({ month, onChangeMonth, children }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Grid container>
      <Grid item container alignItems="center" justifyContent={isMobile ? "space-between" : "center"}>
        <Hidden mdUp>
          <IconButton onClick={() => onChangeMonth(-1)} size="large">
            <NavigateBeforeIcon />
          </IconButton>
        </Hidden>
        <Typography variant="body1" align="center">{`${month.format("MMMM")} - ${month.format("YYYY")}`}</Typography>
        <Hidden mdUp>
          <IconButton onClick={() => onChangeMonth(1)} size="large">
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
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CalendarTable;
