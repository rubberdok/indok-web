import { IconButton, Grid, Typography } from "@material-ui/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CalendarTable from "./CalendarTable";
import { DATE_FORMAT } from "./constants";
import { getDateRange, nextMonthDays, previousMonthDays, rangeLength } from "./helpers";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import DayCell from "./DayCell";

export interface CalendarEvent {
  date: string;
  renderComponent: (key: string) => React.ReactNode;
}

interface CalendarProps {
  disabledDates?: string[];
  rangeChanged: (fromDate: string, toDate: string | undefined) => void;
  initSelectedDay?: string;
  disableRange?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ disabledDates, rangeChanged, initSelectedDay, disableRange }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(dayjs(initSelectedDay));
  const [hoverRange, setHoverRange] = useState<string[]>([]);
  const [isRangeFreezed, setIsRangeFreezed] = useState(false);

  const getDaysOfMonth = (month: dayjs.Dayjs) => {
    const daysOfMonth: JSX.Element[] = [];
    const today = dayjs();
    for (let i = 1; i <= month.daysInMonth(); i++) {
      const date = dayjs(month).set("date", i);
      daysOfMonth.push(
        <Grid item xs component="td" key={date.format(DATE_FORMAT)}>
          <DayCell
            onMouseOver={() =>
              isRangeFreezed || disableRange
                ? null
                : setHoverRange(getDateRange(selectedDay.format(DATE_FORMAT), date.format(DATE_FORMAT)))
            }
            isInHoverRange={hoverRange.includes(date.format(DATE_FORMAT))}
            isSelected={
              date.isSame(selectedDay, "day") ||
              (hoverRange[hoverRange.length - 1] !== undefined && date.isSame(hoverRange[hoverRange.length - 1], "day"))
            }
            onClick={() => handleDateClicked(date)}
            isDisabled={date.isBefore(today, "day") || disabledDates?.includes(date.format(DATE_FORMAT))}
          >
            {i}
          </DayCell>
        </Grid>
      );
    }
    return daysOfMonth;
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

  const handleDateClicked = (date: dayjs.Dayjs) => {
    if (hoverRange.length > 0 && !isRangeFreezed) {
      rangeChanged(hoverRange[0], hoverRange[hoverRange.length - 1]);
      setIsRangeFreezed(true);
    } else {
      rangeChanged(date.format(DATE_FORMAT), undefined);
      setSelectedDay(date);
      setIsRangeFreezed(false);
      setHoverRange([]);
    }
  };

  const onChangeMonth = (months: number) => {
    setSelectedMonth(selectedMonth.add(months, "months"));
  };

  useEffect(() => {
    if (!selectedDay.isSame(selectedMonth, "month")) {
      setSelectedMonth(selectedMonth.set("month", selectedDay.get("month")));
    }
  }, [selectedDay]);

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid item container alignItems="center" justify="space-between" xs>
        <IconButton onClick={() => onChangeMonth(-1)}>
          <NavigateBeforeIcon />
        </IconButton>
        <Typography variant="h6">{`${selectedMonth.format("MMMM")} - ${selectedMonth.format("YYYY")}`}</Typography>
        <IconButton onClick={() => onChangeMonth(1)}>
          <NavigateNextIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <CalendarTable getRows={getRows} month={selectedMonth.clone()} />
      </Grid>
    </Grid>
  );
};

export const createDateRange = getDateRange;
export const getRangeLength = (fromDate: string, toDate: string): number => rangeLength(fromDate, toDate);
export default Calendar;
