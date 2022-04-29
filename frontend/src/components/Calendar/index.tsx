import useBookingSemester from "@hooks/cabins/useBookingSemester";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Hidden, IconButton, Stack, Typography } from "@mui/material";
import { dateInBookingSemester } from "@utils/cabins";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CalendarDay from "./CalendarDay";
import CalendarRow from "./CalendarRow";
import CalendarTable from "./CalendarTable";
import { DATE_FORMAT } from "./constants";
import { getDateRange } from "./helpers";

interface CalendarProps {
  disabledDates?: string[];
  disableAll?: boolean;
  disableBefore?: string;
  disableAfter?: string;
  title?: string;
  onRangeChange?: (fromDate: string | undefined, toDate: string | undefined, validRange: boolean) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  disabledDates,
  disableAll,
  disableBefore,
  disableAfter,
  title,
  onRangeChange,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const [selectingFromDate, setSelectingFromDate] = useState(true);
  const [selectedFromDay, setSelectedFromDay] = useState<dayjs.Dayjs | undefined>(undefined);
  const [selectedToDay, setSelectedToDay] = useState<dayjs.Dayjs | undefined>(undefined);

  const disableBeforeDate = disableBefore ? dayjs(disableBefore) : dayjs();
  const disableAfterDate = disableAfter ? dayjs(disableAfter) : undefined;

  const [range, setRange] = useState<string[]>([]);
  const [isRangeValid, setIsRangeValid] = useState(false);

  const { bookingSemester } = useBookingSemester();

  useEffect(() => {
    setRange([]);
    setSelectedFromDay(undefined);
    setSelectedToDay(undefined);
  }, [disableAll]);

  const handleDateClicked = (date: dayjs.Dayjs, month: dayjs.Dayjs) => {
    if (!isDisabled(date) && !isHidden(date, month)) {
      const setDate = (
        newDate: dayjs.Dayjs,
        setFunc: React.Dispatch<React.SetStateAction<dayjs.Dayjs | undefined>>
      ) => {
        setFunc(isDisabled(newDate) ? undefined : newDate);
        setSelectingFromDate((prev) => !prev);
      };
      if (range.length > 0 || (!selectingFromDate && selectedFromDay && date.isSameOrBefore(selectedFromDay))) {
        setSelectedFromDay(date);
        setSelectedToDay(undefined);
        setSelectingFromDate(false);
      } else {
        if (selectingFromDate) {
          setDate(date, setSelectedFromDay);
        } else {
          setDate(date, setSelectedToDay);
        }
      }
    }
  };

  /*
  Handles what happens to the calendar date range when the user selects (or deselects) from dates and to dates.
  */
  useEffect(() => {
    const dateToString = (date: dayjs.Dayjs | undefined): string | undefined =>
      date ? date.format(DATE_FORMAT) : undefined;
    if (selectedFromDay && selectedToDay) {
      // Both from day and to day are selected, create new range between those two.
      const newRange = getDateRange(selectedFromDay.format(DATE_FORMAT), selectedToDay.format(DATE_FORMAT));
      setRange(newRange);

      // Check validity of the given range. If it is valid, the range is marked as green, otherwise it is marked as red.
      const newIsRangeValid = disabledDates ? !disabledDates.some((date: string) => newRange.includes(date)) : true;
      setIsRangeValid(newIsRangeValid);
      onRangeChange && onRangeChange(dateToString(selectedFromDay), dateToString(selectedToDay), newIsRangeValid);
    } else {
      // From day is either selected or not, but to day has not been selected.
      setRange([]);
      setIsRangeValid(true);
      onRangeChange && onRangeChange(dateToString(selectedFromDay), dateToString(selectedToDay), true);
    }
  }, [selectedFromDay, selectedToDay]);

  const isDisabled = (date: dayjs.Dayjs) => {
    return (
      disableAll ||
      date.isBefore(disableBeforeDate, "day") ||
      (disableAfterDate ? date.isAfter(disableAfterDate) : false) ||
      disabledDates?.includes(date.format(DATE_FORMAT)) ||
      !dateInBookingSemester(date, bookingSemester)
    );
  };

  const isHidden = (date: dayjs.Dayjs, month: dayjs.Dayjs) => {
    return date.month() != month.month();
  };

  const previousMonthDays = (month: dayjs.Dayjs): dayjs.Dayjs[] => {
    const previousDays: dayjs.Dayjs[] = [];
    const firstOfMonth = month.startOf("month");
    const mondayIndex = 0;
    // Check if Month starts with a Monday
    if (firstOfMonth.weekday() !== mondayIndex) {
      const previousMonday = firstOfMonth.subtract(1, "months").endOf("month").weekday(mondayIndex);
      const dayDifference = firstOfMonth.diff(previousMonday, "days") + 1;

      for (let i = 0; i < dayDifference; i++) {
        const date = firstOfMonth.subtract(dayDifference - i, "day");
        previousDays.push(date);
      }
    }
    return previousDays;
  };

  const getDaysOfMonth = (month: dayjs.Dayjs): dayjs.Dayjs[] => {
    const daysOfMonth: dayjs.Dayjs[] = [];
    for (let i = 1; i <= month.daysInMonth(); i++) {
      const date = dayjs(month).set("date", i);
      daysOfMonth.push(date);
    }
    return daysOfMonth;
  };

  const nextMonthDays = (month: dayjs.Dayjs): dayjs.Dayjs[] => {
    const nextDays: dayjs.Dayjs[] = [];
    const endOfMonth = month.endOf("month");
    const sundayIndex = 6;

    // Check if Month ends with a sunday
    if (endOfMonth.weekday() !== sundayIndex) {
      const nextSunday = endOfMonth.add(1, "months").startOf("month").weekday(sundayIndex);
      const dayDifference = nextSunday.diff(endOfMonth, "days") + 1;

      for (let i = 0; i < dayDifference; i++) {
        const date = dayjs(endOfMonth).add(i + 1, "day");
        nextDays.push(date);
      }
    }
    return nextDays;
  };

  const getRows = (month: dayjs.Dayjs) => {
    const days: dayjs.Dayjs[] = [...previousMonthDays(month), ...getDaysOfMonth(month), ...nextMonthDays(month)];
    let cells: dayjs.Dayjs[] = [];
    return days.reduce((prev: dayjs.Dayjs[][], curr, index) => {
      if (index % 7 === 0 && index != 0) {
        // When we reach 7 days, push new Row
        prev.push(cells);
        // Clear Cells
        cells = [];
      }
      // Push current cell to cells
      cells.push(curr);
      // We reached the end, push last row
      if (index === days.length - 1) {
        prev.push(cells);
      }
      return prev;
    }, []);
  };

  const onChangeMonth = (months: number) => {
    const newSelectedMonth = selectedMonth.add(months, "months");
    setSelectedMonth(newSelectedMonth);
  };

  return (
    <Stack spacing={2} width={1} justifyContent="center">
      <Stack direction="row" width={1} justifyContent="space-between" alignItems="center">
        <Hidden lgDown>
          <IconButton onClick={() => onChangeMonth(-1)} size="large">
            <NavigateBeforeIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h5" align="center">
          {title}
        </Typography>
        <Hidden lgDown>
          <IconButton onClick={() => onChangeMonth(1)} size="large">
            <NavigateNextIcon />
          </IconButton>
        </Hidden>
      </Stack>
      <Stack spacing={5} direction="row" alignItems="flex-start">
        <CalendarTable month={selectedMonth} onChangeMonth={onChangeMonth}>
          {getRows(selectedMonth).map((row, index) => (
            <CalendarRow key={index} index={index}>
              {row.map((date) => (
                <CalendarDay
                  value={date.date()}
                  isFromDate={selectedFromDay ? date.isSame(selectedFromDay, "day") : false}
                  isToDate={selectedToDay ? date.isSame(selectedToDay, "day") : false}
                  onClick={() => handleDateClicked(date, selectedMonth)}
                  isDisabled={isDisabled(date)}
                  isHidden={isHidden(date, selectedMonth)}
                  isInRange={range.includes(date.format(DATE_FORMAT))}
                  isInvalidRange={!isRangeValid}
                  key={date.format(DATE_FORMAT)}
                />
              ))}
            </CalendarRow>
          ))}
        </CalendarTable>
        <Hidden lgDown>
          <CalendarTable month={selectedMonth.add(1, "month")} onChangeMonth={onChangeMonth}>
            {getRows(selectedMonth.add(1, "month")).map((row, index) => (
              <CalendarRow key={index} index={index}>
                {row.map((date) => (
                  <CalendarDay
                    value={date.date()}
                    isFromDate={selectedFromDay ? date.isSame(selectedFromDay, "day") : false}
                    isToDate={selectedToDay ? date.isSame(selectedToDay, "day") : false}
                    onClick={() => handleDateClicked(date, selectedMonth.add(1, "month"))}
                    isDisabled={isDisabled(date)}
                    isHidden={isHidden(date, selectedMonth.add(1, "month"))}
                    isInRange={range.includes(date.format(DATE_FORMAT))}
                    isInvalidRange={!isRangeValid}
                    key={date.format(DATE_FORMAT)}
                  />
                ))}
              </CalendarRow>
            ))}
          </CalendarTable>
        </Hidden>
      </Stack>
    </Stack>
  );
};

export default Calendar;
