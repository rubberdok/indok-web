import { useQuery } from "@apollo/client";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Button, Checkbox, Divider, FormControlLabel, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";

import { Calendar } from "@/components/Calendar";
import { BookingSemesterDocument, CabinFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";
import { useOverlappingBookings } from "./useOverlappingBookings";

import { Stepper } from "./Stepper";

type Props = {
  allCabins: CabinFragment[];
  chosenCabins: CabinFragment[];
  onCabinsChange: (cabins: CabinFragment[]) => void;
  onDateChange: (date: dayjs.Dayjs) => void;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  onNext: () => void;
};

type Validation =
  | {
      valid: false;
      error: string;
    }
  | { valid: true; error?: never };

/**
 * One of the steps in the cabins/book page. In this step the user chooses a cabin and the check-in and check-out dates.
 */
export const CheckInOut: React.FC<React.PropsWithChildren<Props>> = ({
  allCabins,
  chosenCabins,
  onCabinsChange,
  onDateChange,
  startDate,
  endDate,
  onNext,
}) => {
  const { isInActiveBookingSemester } = useIsInActiveBookingSemester();
  const { hasOverlapWithOtherBookings, isDateWithOverlappingBooking } = useOverlappingBookings();

  /**
   * Validate that at least one cabin has been chosen, and that the
   * selected dates are valid, i.e. not overlapping with disabled dates.
   */
  function validateCabinAndDateSelection(
    chosenCabins: CabinFragment[],
    dates: { start: dayjs.Dayjs | undefined; end: dayjs.Dayjs | undefined }
  ): Validation {
    const { start, end } = dates;

    if (chosenCabins.length === 0) {
      return { valid: false, error: "Du må velge en hytte" };
    }

    // The user needs to enter a check-in date
    if (start === undefined) {
      return { valid: false, error: "Du må velge en dato for innsjekk" };
    }
    // The user needs to enter a check-out date
    if (end === undefined) {
      return { valid: false, error: "Du må velge en dato for utsjekk" };
    }

    if (hasOverlapWithOtherBookings({ start, end }, chosenCabins)) {
      return { valid: false, error: "Denne datoen er allerede booket" };
    }

    return { valid: true };
  }

  const validation = validateCabinAndDateSelection(chosenCabins, { start: startDate, end: endDate });

  /**
   * Dates are disabled if:
   * 1. No cabin is selected
   * 2. The date is not in the active booking semester
   * 3. The date has an overlapping booking
   * 4. The date is before today
   */
  function isDateDisabled(date: dayjs.Dayjs) {
    const cabinNotSelected = chosenCabins.length === 0;
    if (cabinNotSelected) return true;
    if (!isInActiveBookingSemester(date)) return true;
    if (isDateWithOverlappingBooking(date, chosenCabins)) return true;
    if (date.isBefore(dayjs(), "day")) return true;
    return false;
  }

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "flex-start" }}
        spacing={{ xs: 2, md: 4 }}
      >
        <Stack
          component={Paper}
          direction={{ xs: "row", md: "column" }}
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={1}
          minWidth={200}
          bgcolor="background.elevated"
          p={3}
          elevation={0}
        >
          <Typography variant="h5">Velg hytte</Typography>

          {allCabins.map((cabin) => (
            <FormControlLabel
              key={cabin.id}
              label={
                <Typography variant="subtitle2" component="p">
                  {cabin.name}
                </Typography>
              }
              control={
                <Checkbox
                  color="primary"
                  disableRipple
                  checked={chosenCabins.some((chosenCabin) => chosenCabin.id === cabin.id)}
                  onChange={(_, checked) => {
                    if (checked) {
                      onCabinsChange([...chosenCabins, cabin]);
                    } else {
                      onCabinsChange(chosenCabins.filter((chosenCabin) => cabin.id !== chosenCabin.id));
                    }
                  }}
                />
              }
            />
          ))}
        </Stack>
        <Divider sx={{ my: 2, display: { xs: "block", md: "none" } }} />
        <Paper sx={{ p: 3, bgcolor: "background.elevated", width: 1 }} elevation={0}>
          <Calendar
            onDateClick={onDateChange}
            title="Velg innsjekk og utsjekk"
            startDate={startDate}
            endDate={endDate}
            isDateDisabled={isDateDisabled}
          />
        </Paper>
      </Stack>
      <Stepper
        nextButton={
          <Tooltip title={validation.error} arrow placement="left">
            <span>
              <Button
                endIcon={<KeyboardArrowRight />}
                variant="contained"
                disabled={!validation.valid}
                onClick={onNext}
              >
                Neste
              </Button>
            </span>
          </Tooltip>
        }
      />
    </>
  );
};

/**
 * Hook that returns a function that takes a date and returns true if the date is in the active booking semester.
 * @returns {isInActiveBookingSemester} A function that takes a date and returns true if the date is in the active booking semester.

* @example
 * ```ts
 * const { isInActiveBookingSemester } = useIsInActiveBookingSemester();
 * const date = dayjs("2021-09-01");
 * isInActiveBookingSemester(date); // true
 * ```
 */
function useIsInActiveBookingSemester(): { isInActiveBookingSemester: (date: dayjs.Dayjs) => boolean } {
  const { data } = useQuery(BookingSemesterDocument);

  function isInActiveBookingSemester(date: dayjs.Dayjs) {
    if (!data?.bookingSemester) {
      return false;
    }

    const { fallStartDate, fallEndDate, fallSemesterActive, springStartDate, springEndDate, springSemesterActive } =
      data.bookingSemester;
    let inFallSemester = false;
    let inSpringSemester = false;

    if (fallSemesterActive) {
      inFallSemester = date.isBetween(fallStartDate, fallEndDate, "day", "[]");
    }
    if (springSemesterActive) {
      inSpringSemester = date.isBetween(springStartDate, springEndDate, "day", "[]");
    }

    return inFallSemester || inSpringSemester;
  }

  return { isInActiveBookingSemester };
}
