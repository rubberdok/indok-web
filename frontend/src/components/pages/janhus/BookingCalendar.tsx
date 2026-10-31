import { useQuery } from "@apollo/client/react";
import { Alert, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { Calendar } from "@/components/Calendar";
import {
  JanHusAreasDocument,
  JanHusAreasQuery,
  JanHusBookingCalendarDocument,
  JanHusBookingCalendarQuery,
  JanHusBookingSettingsDocument,
} from "@/generated/graphql";
import dayjs from "@/lib/date";

type CalendarBooking = NonNullable<JanHusBookingCalendarQuery["janhusBookings"]>[number];
type Area = NonNullable<JanHusAreasQuery["janhusAreas"]>[number];
type Interval = { start: dayjs.Dayjs; end: dayjs.Dayjs };

/** A day's booking window, as on the booking page: opening to closing hour, into the next day if closing is earlier. */
const bookingWindow = (day: dayjs.Dayjs, openingHour: number, closingHour: number): Interval => {
  const start = day.hour(openingHour).minute(0).second(0).millisecond(0);
  const end = day.hour(closingHour).minute(0).second(0).millisecond(0);
  return { start, end: openingHour >= closingHour ? end.add(1, "day") : end };
};

const isListed = (booking: CalendarBooking) => booking.status === "CONFIRMED" || booking.status === "BLOCKED";

const overlaps = (booking: CalendarBooking, window: Interval) =>
  dayjs(booking.startsAt).isBefore(window.end) && dayjs(booking.endsAt).isAfter(window.start);

const timeLabel = (time: dayjs.Dayjs, day: dayjs.Dayjs) => {
  if (time.isSame(day, "day")) {
    return time.format("HH:mm");
  }
  if (time.isSame(day.add(1, "day"), "day")) {
    return `${time.format("HH:mm")} (+1 dag)`;
  }
  return time.format("D. MMM HH:mm");
};

const intervalLabel = (interval: Interval, day: dayjs.Dayjs) =>
  `${timeLabel(interval.start, day)}–${timeLabel(interval.end, day)}`;

/** Overlapping and touching intervals become one. */
const merged = (intervals: Interval[]) => {
  const result: Interval[] = [];
  for (const interval of [...intervals].sort((a, b) => a.start.valueOf() - b.start.valueOf())) {
    const last = result.at(-1);
    if (last && !interval.start.isAfter(last.end)) {
      last.end = interval.end.isAfter(last.end) ? interval.end : last.end;
    } else {
      result.push({ ...interval });
    }
  }
  return result;
};

/** Areas with the ones inside them right after, for indenting. */
const inTreeOrder = (areas: readonly Area[]) => {
  const ids = new Set(areas.map((area) => area.id));
  const children = new Map<string | undefined, Area[]>();
  for (const area of areas) {
    const parentId = area.parent && ids.has(area.parent.id) ? area.parent.id : undefined;
    children.set(parentId, [...(children.get(parentId) ?? []), area]);
  }
  const ordered: { area: Area; depth: number }[] = [];
  const visit = (parentId: string | undefined, depth: number) => {
    for (const area of children.get(parentId) ?? []) {
      ordered.push({ area, depth });
      visit(area.id, depth + 1);
    }
  };
  visit(undefined, 0);
  return ordered;
};

/**
 * Coming JanHus bookings for everyone: a dot per booking, and for the chosen date which areas are taken and when,
 * and who has each booking.
 */
export const BookingCalendar: React.FC = () => {
  const [today] = useState(() => dayjs().tz().startOf("day"));
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | undefined>(undefined);
  const { data, error } = useQuery(JanHusBookingCalendarDocument, {
    variables: { startsAt: today.toISOString() },
  });
  const { data: areaData } = useQuery(JanHusAreasDocument);
  const { data: settingsData } = useQuery(JanHusBookingSettingsDocument);

  const settings = settingsData?.janhusBookingSettings;
  const openingHour = settings?.openingHour ?? 0;
  const closingHour = settings?.closingHour ?? 0;
  const bufferMinutes = Math.max(settings?.bufferMinutes ?? 0, 0);

  const bookingsOn = useMemo(() => {
    const bookings = data?.janhusBookings ?? [];
    return (day: dayjs.Dayjs) => {
      const window = bookingWindow(day, openingHour, closingHour);
      return bookings.filter((booking) => overlaps(booking, window));
    };
  }, [data, openingHour, closingHour]);

  const selectedBookings = useMemo(() => (selectedDate ? bookingsOn(selectedDate) : []), [bookingsOn, selectedDate]);

  const areaAvailability = useMemo(
    () =>
      inTreeOrder(areaData?.janhusAreas ?? []).map(({ area, depth }) => {
        // An area is taken when it, an area it is part of, or an area inside it is booked.
        const conflictingAreaIds = area.conflictingAreaIds ?? [area.id];
        const taken = merged(
          selectedBookings
            .filter((booking) => conflictingAreaIds.includes(booking.area.id))
            .map((booking) => ({ start: dayjs(booking.startsAt), end: dayjs(booking.endsAt) }))
        );
        return { area, depth, taken };
      }),
    [areaData, selectedBookings]
  );

  const listedBookings = useMemo(() => selectedBookings.filter(isListed), [selectedBookings]);
  const someAreWaiting = listedBookings.length < selectedBookings.length;
  const emptyDayText = someAreWaiting ? "Ingen bekreftede bookinger denne dagen." : "Ingen bookinger denne dagen.";
  const namesHidden = listedBookings.some((booking) => !booking.ownerDisplayName && booking.status !== "BLOCKED");

  return (
    <Stack spacing={2}>
      {error ? <Alert severity="error">Kunne ikke hente bookingene.</Alert> : null}
      <Calendar
        onDateClick={(date) => setSelectedDate(date.startOf("day"))}
        startDate={selectedDate}
        endDate={selectedDate}
        isDateDisabled={(date) => date.isBefore(today, "day")}
        getMarkerCount={(date) => bookingsOn(date).length}
      />
      {selectedDate ? (
        <Stack spacing={2}>
          <Typography variant="subtitle1" textTransform="capitalize">
            {selectedDate.format("dddd D. MMMM")}
          </Typography>

          {areaAvailability.length > 0 ? (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Områder</Typography>
              <List dense disablePadding>
                {areaAvailability.map(({ area, depth, taken }) => (
                  <ListItem key={area.id} disableGutters sx={{ pl: depth * 2 }}>
                    <ListItemText
                      primary={area.name}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color={taken.length ? "warning.main" : "success.main"}
                        >
                          {taken.length
                            ? `Opptatt ${taken.map((interval) => intervalLabel(interval, selectedDate)).join(", ")}`
                            : "Ledig"}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary">
                Et område er opptatt når det selv, et område det er en del av, eller et område i det er booket. (Tenk
                CHILD-PARENT, eller google det om det ikke gir mening.)
                {bufferMinutes > 0 ? ` I tillegg holdes ${bufferMinutes} minutter fri før og etter hver booking.` : ""}
                {someAreWaiting ? " Noe av tiden er holdt av en booking som venter på betaling eller behandling." : ""}
              </Typography>
            </Stack>
          ) : null}

          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Bookinger</Typography>
            {listedBookings.length === 0 ? (
              <Typography color="text.secondary">{emptyDayText}</Typography>
            ) : (
              <List dense disablePadding>
                {listedBookings.map((booking) => (
                  <ListItem key={booking.id} disableGutters>
                    <ListItemText
                      primary={booking.status === "BLOCKED" ? "Stengt" : (booking.ownerDisplayName ?? "Booket")}
                      secondary={`${intervalLabel(
                        { start: dayjs(booking.startsAt), end: dayjs(booking.endsAt) },
                        selectedDate
                      )} · ${booking.area.name}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            {namesHidden ? (
              <Typography variant="body2" color="text.secondary">
                Logg inn for å se hvem som har booket.
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};
