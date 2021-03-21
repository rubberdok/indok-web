import { IconButton, Grid, Typography, Divider } from "@material-ui/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import CalendarTable from "./CalendarTable";
import { DATE_FORMAT } from "./constants";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import DayCell from "./DayCell";

interface CalendarProps {
  disabledDates?: string[];
  disableAll?: boolean;
  disableBefore?: string;
  disableAfter?: string;
  title?: string;
}

const Calendar: React.FC<CalendarProps> = ({ disabledDates, disableAll, disableBefore, disableAfter, title }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const [selectingFromDate, setselectingFromDate] = useState(true);
  const [selectedFromDay, setSelectedFromDay] = useState<dayjs.Dayjs | undefined>(undefined);
  const [selectedToDay, setselectedToDay] = useState<dayjs.Dayjs | undefined>(undefined);

  const disableBeforeDate = disableBefore ? dayjs(disableBefore) : dayjs();
  const disableAfterDate = disableAfter ? dayjs(disableAfter) : undefined;

  const handleDateClicked = (date: dayjs.Dayjs) => {
    const setDate = (date: dayjs.Dayjs, setFunc: React.Dispatch<React.SetStateAction<dayjs.Dayjs | undefined>>) => {
      setFunc(isDisabled(date) ? undefined : date);
      setselectingFromDate((prev) => !prev);
    };
    if (selectingFromDate) {
      setDate(date, setSelectedFromDay);
    } else {
      setDate(date, setselectedToDay);
    }
  };

  const isDisabled = (date: dayjs.Dayjs) => {
    return (
      disableAll ||
      date.isBefore(disableBeforeDate, "day") ||
      (disableAfterDate ? date.isAfter(disableAfterDate) : false) ||
      disabledDates?.includes(date.format(DATE_FORMAT))
    );
  };

  const previousMonthDays = (month: dayjs.Dayjs): JSX.Element[] => {
    const previousDays: JSX.Element[] = [];
    const firstOfMonth = month.startOf("month");
    const mondayIndex = 0;
    // Check if Month starts with a Monday
    if (firstOfMonth.weekday() !== mondayIndex) {
      const previousMonday = firstOfMonth.subtract(1, "months").endOf("month").weekday(mondayIndex);
      const dayDifference = firstOfMonth.diff(previousMonday, "days") + 1;

      for (let i = 0; i < dayDifference; i++) {
        const date = firstOfMonth.subtract(dayDifference - i, "day");
        previousDays.push(<DayCell key={`prev-${date.format(DATE_FORMAT)}`} isHidden />);
      }
    }
    return previousDays;
  };

  const getDaysOfMonth = (month: dayjs.Dayjs) => {
    const daysOfMonth: JSX.Element[] = [];
    for (let i = 1; i <= month.daysInMonth(); i++) {
      const date = dayjs(month).set("date", i);
      daysOfMonth.push(
        <DayCell
          value={i}
          isFromDate={selectedFromDay ? date.isSame(selectedFromDay, "day") : false}
          isToDate={selectedToDay ? date.isSame(selectedToDay, "day") : false}
          onClick={() => handleDateClicked(date)}
          isDisabled={isDisabled(date)}
          key={date.format(DATE_FORMAT)}
        />
      );
    }
    return daysOfMonth;
  };

  const nextMonthDays = (month: dayjs.Dayjs): JSX.Element[] => {
    const nextDays: JSX.Element[] = [];
    const endOfMonth = month.endOf("month");
    const sundayIndex = 6;

    // Check if Month ends with a sunday
    if (endOfMonth.weekday() !== sundayIndex) {
      const nextSunday = endOfMonth.add(1, "months").startOf("month").weekday(sundayIndex);
      const dayDifference = nextSunday.diff(endOfMonth, "days") + 1;

      for (let i = 0; i < dayDifference; i++) {
        const date = dayjs(endOfMonth).add(i + 1, "day");
        nextDays.push(<DayCell key={`next-${date.format(DATE_FORMAT)}`} isHidden />);
      }
    }
    return nextDays;
  };

  const getRows = (month: dayjs.Dayjs) => {
    const slots: JSX.Element[] = [...previousMonthDays(month), ...getDaysOfMonth(month), ...nextMonthDays(month)];
    let cells: JSX.Element[];
    return slots.reduce(
      (prev: JSX.Element[][], curr, index) => {
        if (index % 7 === 0) {
          // When we reach 7 days, push new Row
          prev.push(cells);
          // Clear Cells
          cells = [];
        }
        // Push current cell to cells
        cells.push(curr);
        // We reached the end, push last row
        if (index === slots.length - 1) {
          prev.push(cells);
        }
        return prev;
      },
      [[]]
    );
  };

  const onChangeMonth = (months: number) => {
    const newSelectedMonth = selectedMonth.add(months, "months");
    setSelectedMonth(newSelectedMonth);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justify="space-between" xs>
        <IconButton onClick={() => onChangeMonth(-1)}>
          <NavigateBeforeIcon />
        </IconButton>
        <Typography variant="h5" align="center">
          {title}
        </Typography>
        <IconButton onClick={() => onChangeMonth(1)}>
          <NavigateNextIcon />
        </IconButton>
      </Grid>
      <Divider variant="middle" />
      <Grid item container>
        <Grid item xs>
          <CalendarTable getRows={getRows} month={selectedMonth.clone()} />
        </Grid>
        <Divider variant="fullWidth" orientation="vertical" />
        <Grid item xs>
          <CalendarTable getRows={getRows} month={selectedMonth.clone().add(1, "month")} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Calendar;
