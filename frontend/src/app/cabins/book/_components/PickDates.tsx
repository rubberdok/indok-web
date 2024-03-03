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
  onSubmit: (values: { cabins: string[]; dates: { start: Date; end: Date } }) => void;
};

const PickDatesCabinFragment = graphql(`
  fragment PickDates_Cabin on Cabin {
    id
    name
  }
`);

function PickDates({ onSubmit, ...props }: Props) {
  const cabins = getFragmentData(PickDatesCabinFragment, props.cabins);
  const [dates, setDates] = useState(props.dates);
  const [selectedCabins, setSelectedCabins] = useState(props.selectedCabins.map((cabin) => cabin.id));

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
                      checked={selectedCabins.some((selectedCabin) => selectedCabin === cabin.id)}
                      onChange={(_, checked) => {
                        if (checked) {
                          setSelectedCabins([...selectedCabins.map((cabin) => cabin), cabin.id]);
                        } else {
                          setSelectedCabins(selectedCabins.filter((chosenCabin) => cabin.id !== chosenCabin));
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
              isDateDisabled={(date) => selectedCabins.length === 0}
              onDateClick={(date) => handleDateChanged(date)}
            />
          </Stack>
        </CardContent>
        <CardActions>
          <Stack direction="row" width="100%" justifyContent="flex-end" spacing={2}>
            <Button
              endIcon={<KeyboardArrowRight />}
              disabled={!dates.start || !dates.end || selectedCabins.length === 0}
              onClick={() => {
                if (!dates.start || !dates.end) return;
                if (selectedCabins.length === 0) return;
                onSubmit({ cabins: selectedCabins, dates: { start: dates.start, end: dates.end } });
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
