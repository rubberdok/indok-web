import { Calendar } from "@/components/Calendar";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

type Props = {
  dates: { start: Date | undefined; end: Date | undefined };
  selectedCabins: { id: string; name: string }[];
  cabins: FragmentType<typeof PickDatesCabinFragment>[];
  calendarMonths: FragmentType<typeof PickDatesCalendarMonthFragment>[];
  onCabinsChange: (cabins: { id: string; name: string }[]) => void;
  onDatesChange: (dates: { start: Date | undefined; end: Date | undefined }) => void;
};

const PickDatesCabinFragment = graphql(`
  fragment PickDates_Cabin on Cabin {
    id
    name
  }
`);

const PickDatesCalendarMonthFragment = graphql(`
  fragment PickDates_CalendarMonth on CalendarMonth {
    month
    year
    days {
      calendarDate
      bookable
      available
      availableForCheckIn
      availableForCheckOut
      price
    }
  }
`);

function PickDates({ onCabinsChange, selectedCabins, ...props }: Props) {
  const cabins = getFragmentData(PickDatesCabinFragment, props.cabins);
  const calendarMonths = getFragmentData(PickDatesCalendarMonthFragment, props.calendarMonths);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [dates, setDates] = useState(props.dates);

  /**
   * Update the booking dates when the user selects a new date in the calendar.
   * The dates are updated accordingly:
   * 1. If the user has not yet selected a start date, then we set the start date to the date the user has chosen.
   * 2. If the user has selected a start date, and the new date is the same as the start date, then we reset the range.
   * 3. If the user has selected a start date, and the new date is after the start date, then we set that as the
   *   current end date
   * 4. If the user has selected a start date, and the new date is before the start date, then we set that as the
   *  current start date
   * 5. If none of the above conditions are met, we make no changes.
   *
   * @param date The date the user has chosen
   */
  function handleDateChanged(date: dayjs.Dayjs) {
    const start = dates.start && dayjs(dates.start);
    const end = dates.end && dayjs(dates.end);

    /**
     * If start is not set, then we set the start date to the date the user has chosen.
     */
    if (!start) {
      return setDates({ start: date.toDate(), end: undefined });
    }

    /**
     * If start is set, and the user clicks the start day, we reset the range.
     */
    if (start?.isSame(date, "day")) {
      return setDates({ start: undefined, end: undefined });
    }

    /**
     * If the user has already selected a date range, then we reset the range and start a new one.
     */
    if (start && end) {
      return setDates({ start: date.toDate(), end: undefined });
    }

    /**
     * If the user has selected a start date, and the new date is after the start date, then we set that as the
     * current end date
     */
    if (start && date.isAfter(start, "day")) {
      return setDates({ start: dates.start, end: date.toDate() });
    }

    /**
     * If the user has selected a start date, and the new date is before the start date, then we set that as the
     * current start date
     */
    if (start && date.isBefore(start, "day")) {
      return setDates({ start: date.toDate(), end: undefined });
    }
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            divider={
              <>
                <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" } }} flexItem />
                <Divider orientation="horizontal" sx={{ display: { xs: "block", md: "none" } }} flexItem />
              </>
            }
          >
            <Stack
              direction={{ xs: "row", md: "column" }}
              alignItems={{ xs: "center", md: "flex-start" }}
              spacing={1}
              minWidth={200}
            >
              <Typography variant="h5">Velg hytte</Typography>
              {cabins.map((cabin) => (
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
                      checked={selectedCabins.some((selectedCabin) => selectedCabin.id === cabin.id)}
                      onChange={(_, checked) => {
                        if (checked) {
                          onCabinsChange([...selectedCabins, cabin]);
                        } else {
                          onCabinsChange(selectedCabins.filter((chosenCabin) => cabin.id !== chosenCabin.id));
                        }
                      }}
                    />
                  }
                />
              ))}
            </Stack>
            <Calendar
              title="Velg innsjekk og utsjekk"
              startDate={dates.start && dayjs(dates.start)}
              endDate={dates.end && dayjs(dates.end)}
              calendarMonths={calendarMonths}
              onDateClick={(date) => handleDateChanged(date)}
              currentMonthIndex={currentMonthIndex}
              onCurrentMonthIndexChanged={(index) => {
                if (index < 0 || index >= calendarMonths.length) return;
                setCurrentMonthIndex(index);
              }}
            />
          </Stack>
        </CardContent>
        <CardActions>
          <Stack direction="row" width="100%" justifyContent="flex-end" spacing={2}>
            <Button
              endIcon={<KeyboardArrowRight />}
              onClick={() => {
                if (!dates.start || !dates.end) return;
                if (selectedCabins.length === 0) return;
              }}
            >
              Neste
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </>
  );
}

export { PickDates };
