import DayCell from "./DayCell";
import { DATE_FORMAT } from "./constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/nb";
import { Grid } from "@material-ui/core";

dayjs.locale("nb");
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

export const getDateRange = (start: string, end: string): string[] => {
  let startDate = dayjs(start);
  const endDate = dayjs(end);
  const output = [];
  while (startDate.isSameOrBefore(endDate, "date")) {
    output.push(startDate.format(DATE_FORMAT));
    startDate = startDate.add(1, "day");
  }
  return output;
};
export const rangeLength = (startDay: string, endDay: string): number => {
  return dayjs(endDay).diff(dayjs(startDay), "days") + 1;
};

export const previousMonthDays = (month: dayjs.Dayjs): JSX.Element[] => {
  const previousDays: JSX.Element[] = [];
  const firstOfMonth = month.startOf("month");
  const mondayIndex = 0;
  // Check if Month starts with a Monday
  if (firstOfMonth.weekday() !== mondayIndex) {
    const previousMonday = firstOfMonth.subtract(1, "months").endOf("month").weekday(mondayIndex);
    const dayDifference = firstOfMonth.diff(previousMonday, "days") + 1;

    for (let i = 0; i < dayDifference; i++) {
      const date = firstOfMonth.subtract(dayDifference - i, "day");
      previousDays.push(
        <Grid item xs component="td" key={`prev-${date.format(DATE_FORMAT)}`}>
          <DayCell isHidden></DayCell>
        </Grid>
      );
    }
  }
  return previousDays;
};

export const nextMonthDays = (month: dayjs.Dayjs): JSX.Element[] => {
  const nextDays: JSX.Element[] = [];
  const endOfMonth = month.endOf("month");
  const sundayIndex = 6;

  // Check if Month ends with a sunday
  if (endOfMonth.weekday() !== sundayIndex) {
    const nextSunday = endOfMonth.add(1, "months").startOf("month").weekday(sundayIndex);
    const dayDifference = nextSunday.diff(endOfMonth, "days") + 1;

    for (let i = 0; i < dayDifference; i++) {
      const date = dayjs(endOfMonth).add(i + 1, "day");
      nextDays.push(
        <Grid item xs component="td" key={`next-${date.format(DATE_FORMAT)}`}>
          <DayCell isHidden></DayCell>
        </Grid>
      );
    }
  }
  return nextDays;
};
