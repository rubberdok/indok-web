import { KeyboardArrowRight } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { Calendar } from "@/components/Calendar";
import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";
import dayjs from "@/lib/date";

import type { BookingStepsProps } from "./types";

const startTimeHelperText = (hasDate: boolean, optionCount: number) => {
  if (!hasDate) return "Velg dato i kalenderen for å vise starttider.";
  if (optionCount === 0) return "Ingen ledige starttider på valgt dato/område.";
  return "Viser kun tider som har minst én gyldig og ledig sluttid.";
};

const endTimeHelperText = (hasStart: boolean, optionCount: number, minDurationMinutes: number) => {
  if (!hasStart) return `Velg starttid først (minst ${minDurationMinutes} min varighet).`;
  if (optionCount === 0) return "Ingen gyldige ledige sluttider for valgt starttid.";
  return "Sluttid må følge granularitet og være ledig.";
};

export const TimeStep: React.FC<BookingStepsProps> = ({
  bookingDate,
  startsAt,
  endsAt,
  area,
  areaOptions,
  startOptions,
  endOptions,
  minDurationMinutes,
  openingHour,
  closingHour,
  selectedDurationMinutes,
  isBookingDateDisabled,
  lastBookableDate,
  onAreaChange,
  onBookingDateChange,
  onStartsAtChange,
  onEndsAtChange,
  onBookingStepNext,
}) => {
  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary">
          Flyt: velg område, velg dato i kalender, og velg et ledig tidsrom.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Minimum {minDurationMinutes / 60} time per booking, kan kun bookes mellom {openingHour}:00–{closingHour}
          :00.
        </Typography>

        {startsAt && endsAt && selectedDurationMinutes ? (
          <Alert severity="success">
            Valgt tidsrom: {dayjs(startsAt).format("DD.MM.YYYY HH:mm")} – {dayjs(endsAt).format("DD.MM.YYYY HH:mm")} (
            {selectedDurationMinutes} min)
          </Alert>
        ) : null}

        <Typography variant="h5">1) Velg område</Typography>
        <FormControl fullWidth>
          <InputLabel>Område</InputLabel>
          <Select value={area} label="Område" onChange={(event) => onAreaChange(event.target.value)}>
            {areaOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h5">2) Velg dato</Typography>
        <Calendar
          title="Kalender"
          onDateClick={(date) => onBookingDateChange(date.startOf("day"))}
          startDate={bookingDate}
          endDate={bookingDate}
          isDateDisabled={isBookingDateDisabled}
        />
        {lastBookableDate ? (
          <FormHelperText>Du kan velge datoer til og med {lastBookableDate.format("D. MMMM YYYY")}.</FormHelperText>
        ) : null}

        <Divider />

        <Typography variant="h5">3) Velg ledig tidsrom</Typography>
        <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
          <FormControl>
            <InputLabel>Starttid</InputLabel>
            <Select
              value={startsAt}
              label="Starttid"
              onChange={(event) => onStartsAtChange(event.target.value)}
              disabled={!bookingDate || startOptions.length === 0}
            >
              {startOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{startTimeHelperText(Boolean(bookingDate), startOptions.length)}</FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel>Sluttid</InputLabel>
            <Select
              value={endsAt}
              label="Sluttid"
              onChange={(event) => onEndsAtChange(event.target.value)}
              disabled={!startsAt || endOptions.length === 0}
            >
              {endOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {endTimeHelperText(Boolean(startsAt), endOptions.length, minDurationMinutes)}
            </FormHelperText>
          </FormControl>
        </Box>

        <BookingStepNavigation
          nextButton={
            <Button variant="contained" endIcon={<KeyboardArrowRight />} onClick={onBookingStepNext}>
              Neste
            </Button>
          }
        />
      </Stack>
    </Paper>
  );
};
