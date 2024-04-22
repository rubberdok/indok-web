import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, ButtonBase, IconButton, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import { range } from "lodash";
import React from "react";

import dayjs from "@/lib/date";

type CalendarMonth = {
  month: number;
  year: number;
  days: CalendarDay[];
};

export type CalendarDay = {
  calendarDate: string;
  bookable: boolean;
  price: number;
  available: boolean;
  availableForCheckIn: boolean;
  availableForCheckOut: boolean;
};

type Props = {
  title?: string;
  onDateClick: (date: dayjs.Dayjs) => void;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  calendarMonths: readonly CalendarMonth[];
  currentMonthIndex: number;
  onCurrentMonthIndexChanged: (index: number) => void;
};

export const Calendar: React.FC<Props> = ({
  title,
  onDateClick,
  startDate,
  endDate,
  calendarMonths,
  onCurrentMonthIndexChanged,
  currentMonthIndex,
}) => {
  const currentMonth = calendarMonths[currentMonthIndex];

  return (
    <Stack spacing={2} width={1} justifyContent="center">
      <Typography variant="h5" align="center">
        {title}
      </Typography>
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <IconButton onClick={() => onCurrentMonthIndexChanged(currentMonthIndex - 1)}>
          <NavigateBefore />
        </IconButton>
        <Typography variant="subtitle1" align="center" textTransform="capitalize">
          {currentMonth && dayjs({ month: currentMonth.month - 1, year: currentMonth.year }).format("MMMM YYYY")}
        </Typography>
        <IconButton onClick={() => onCurrentMonthIndexChanged(currentMonthIndex + 1)}>
          <NavigateNext />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={4}>
        <Box
          display="grid"
          gridTemplateColumns={"repeat(7, 1fr)"}
          rowGap={1}
          /**
           * We add some custom styles for the calendar days to make it look more like a booking calendar.
           * The class names below are utilized by `CalendarDay`.
           */
          sx={{
            "& .booking-fromDate": {
              borderRadius: (theme) => `${theme.shape.borderRadius * 2}px 0px 0px ${theme.shape.borderRadius * 2}px`,
              bgcolor: (theme) => theme.vars.palette.primary.light,
              color: (theme) => theme.vars.palette.primary.contrastText,
            },
            "& .booking-toDate": {
              borderRadius: (theme) => `0px ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0px`,
              bgcolor: (theme) => theme.vars.palette.primary.light,
              color: (theme) => theme.vars.palette.primary.contrastText,
            },
            "& .booking-inSelectedRange": {
              bgcolor: (theme) => theme.vars.palette.primary.dark,
              color: (theme) => theme.vars.palette.primary.contrastText,
              borderRadius: 0,
            },
            "& .Mui-disabled": {
              color: (theme) => theme.vars.palette.action.disabled,
            },
            "& .booking-inSelectedRange.Mui-disabled": {
              bgcolor: (theme) => theme.vars.palette.action.disabledBackground,
            },
          }}
        >
          {range(1, 8).map((day) => (
            <Box key={day} gridColumn="span 1" px={1}>
              <Typography variant="body2" color="textSecondary" fontWeight="medium" align="center">
                {dayjs()
                  .day(day % 7)
                  .format("ddd")}
              </Typography>
            </Box>
          ))}
          {currentMonth?.days.map((day) => (
            <Box
              key={day.calendarDate}
              gridColumn={dayjs(day.calendarDate).day() + 1}
              className={clsx({
                "calendar-day": true,
                "booking-fromDate": startDate && startDate.isSame(day.calendarDate, "day"),
                "booking-toDate": endDate && endDate.isSame(day.calendarDate, "day"),
                "booking-inSelectedRange":
                  startDate && endDate && dayjs(day.calendarDate).isBetween(startDate, endDate, "day", "()"),
                "booking-availableForCheckIn": day.availableForCheckIn,
                "booking-availableForCheckOut": day.availableForCheckOut,
              })}
              width={1}
              data-is-day-blocked={!day.bookable || !day.available}
              component={ButtonBase}
              onClick={() => onDateClick(dayjs(day.calendarDate))}
              disabled={!day.bookable || !day.available}
              px={1}
            >
              <Typography variant="body2" color="inherit" fontWeight="medium">
                {dayjs(day.calendarDate).date()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};
