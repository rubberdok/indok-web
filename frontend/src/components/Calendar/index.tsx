import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import dayjs from "@/lib/date";

import { CalendarDay } from "./CalendarDay";
import { CalendarRow } from "./CalendarRow";
import { CalendarTable } from "./CalendarTable";

type Props = {
  title?: string;
  onDateClick: (date: dayjs.Dayjs) => void;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  isDateDisabled: (date: dayjs.Dayjs) => boolean;
};

export const Calendar: React.FC<Props> = ({ title, onDateClick, startDate, endDate, isDateDisabled }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const isHidden = (date: dayjs.Dayjs, month: dayjs.Dayjs) => {
    return date.month() !== month.month();
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

  /**
   * To get a nice looking calendar, we need to group the days into rows.
   * The first row should contain the last days of the previous month, unless the month starts with a monday.
   * The last row should contain the first days of the next month, unless the month ends with a sunday.
   * In addition, if there are fewer than 6 rows, which is the maximum number of rows for any given combination of
   * month and year, we add an extra row to avoid the calendar jumping around when changing month.
   */
  const getRows = (month: dayjs.Dayjs): (dayjs.Dayjs | undefined)[][] => {
    const days: dayjs.Dayjs[] = [...previousMonthDays(month), ...getDaysOfMonth(month), ...nextMonthDays(month)];
    let cells: dayjs.Dayjs[] = [];
    const rows = days.reduce((prev: dayjs.Dayjs[][], curr, index) => {
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

    /**
     * If there are fewer than 6 rows, which is the maximum number of rows for any given combination of
     * month and year, we add an extra row to avoid the calendar jumping around when changing month.
     */
    if (rows.length < 6) {
      rows.push(new Array(7).fill(undefined));
    }
    return rows;
  };

  const onChangeMonth = (months: number) => {
    const newSelectedMonth = selectedMonth.add(months, "months");
    setSelectedMonth(newSelectedMonth);
  };

  return (
    <Stack spacing={2} width={1} justifyContent="center">
      <Typography variant="h5" align="center">
        {title}
      </Typography>
      <Stack
        spacing={5}
        direction="row"
        alignItems="flex-start"
        /**
         * We add some custom styles for the calendar days to make it look more like a booking calendar.
         * The class names below are utilized by `CalendarDay`.
         */
        sx={{
          "& .booking-fromDate": {
            borderRadius: (theme) => `${theme.shape.borderRadius * 2}px 0px 0px ${theme.shape.borderRadius * 2}px`,
            bgcolor: (theme) => theme.vars.palette.primary.light,
          },
          "& .booking-toDate": {
            borderRadius: (theme) => `0px ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0px`,
            bgcolor: (theme) => theme.vars.palette.primary.light,
          },
          "& .booking-inSelectedRange": {
            bgcolor: (theme) => theme.vars.palette.primary.dark,
            borderRadius: 0,
          },
          "& .booking-inSelectedRange.Mui-disabled": {
            bgcolor: (theme) => theme.vars.palette.action.disabledBackground,
          },
        }}
      >
        <CalendarTable
          month={selectedMonth}
          previousMonthIcon={
            <IconButton onClick={() => onChangeMonth(-1)}>
              <NavigateBefore />
            </IconButton>
          }
          nextMonthIcon={
            <Box visibility={{ xs: "visible", lg: "hidden" }}>
              <IconButton onClick={() => onChangeMonth(1)}>
                <NavigateNext />
              </IconButton>
            </Box>
          }
        >
          {getRows(selectedMonth).map((row, index) => (
            <CalendarRow key={`${selectedMonth}${index}`}>
              {row.map((date) => (
                <>
                  {date && (
                    <CalendarDay
                      value={date.date()}
                      isFromDate={startDate && date.isSame(startDate, "day")}
                      isToDate={endDate && date.isSame(endDate, "day")}
                      onClick={() => onDateClick(date)}
                      isDisabled={isDateDisabled(date)}
                      isHidden={isHidden(date, selectedMonth)}
                      isInRange={startDate && endDate && date.isAfter(startDate) && date.isBefore(endDate)}
                      key={date.toISOString()}
                    />
                  )}
                  {/*
                    We add a placeholder cell here to act as a buffer for months where we have fewer than
                    6 rows of days to avoid having the calendar jump when switching months
                  */}
                  {!date && <CalendarDay value=" " isDisabled={true} isHidden={true} />}
                </>
              ))}
            </CalendarRow>
          ))}
        </CalendarTable>
        <Box display={{ xs: "none", lg: "block" }} width={1}>
          <CalendarTable
            month={selectedMonth.add(1, "month")}
            previousMonthIcon={
              <Box visibility={{ xs: "visible", lg: "hidden" }}>
                <IconButton onClick={() => onChangeMonth(-11)}>
                  <NavigateBefore />
                </IconButton>
              </Box>
            }
            nextMonthIcon={
              <IconButton onClick={() => onChangeMonth(1)}>
                <NavigateNext />
              </IconButton>
            }
          >
            {getRows(selectedMonth.add(1, "month")).map((row, index) => (
              <CalendarRow key={`${selectedMonth}${index}2`}>
                {row.map((date) => (
                  <>
                    {date && (
                      <CalendarDay
                        value={date.date()}
                        isFromDate={startDate && date.isSame(startDate, "day")}
                        isToDate={endDate && date.isSame(endDate, "day")}
                        onClick={() => onDateClick(date)}
                        isDisabled={isDateDisabled(date)}
                        isHidden={isHidden(date, selectedMonth.add(1, "month"))}
                        isInRange={startDate && endDate && date.isAfter(startDate) && date.isBefore(endDate)}
                        key={date.toISOString()}
                      />
                    )}
                    {/*
                      We add a placeholder cell here to act as a buffer for months where we have fewer than
                      6 rows of days to avoid having the calendar jump when switching months
                    */}
                    {!date && <CalendarDay value=" " isDisabled={true} isHidden={true} />}
                  </>
                ))}
              </CalendarRow>
            ))}
          </CalendarTable>
        </Box>
      </Stack>
    </Stack>
  );
};
