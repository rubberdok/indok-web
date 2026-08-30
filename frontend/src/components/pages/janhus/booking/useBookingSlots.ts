import { useQuery } from "@apollo/client/react";
import { useCallback, useMemo } from "react";

import { JanHusBookingsDocument } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Area = {
  id: string;
  conflictingAreaIds?: readonly string[] | null;
};

type Params = {
  bookingDay: dayjs.Dayjs | undefined;
  area: string;
  areas: readonly Area[];
  startsAt: string;
  openingHour: number;
  closingHour: number;
  minDurationMinutes: number;
  slotGranularityMinutes: number;
  bufferMinutes: number;
};

const formatSlotLabel = (slot: dayjs.Dayjs, baseDay?: dayjs.Dayjs) => {
  const nextDay = baseDay ? !slot.isSame(baseDay, "day") : false;
  return `${slot.format("HH:mm")}${nextDay ? " (+1 dag)" : ""}`;
};

export function useBookingSlots({
  bookingDay,
  area,
  areas,
  startsAt,
  openingHour,
  closingHour,
  minDurationMinutes,
  slotGranularityMinutes,
  bufferMinutes,
}: Params) {
  const bookingWindow = useMemo(() => {
    if (!bookingDay) {
      return undefined;
    }

    const windowStart = bookingDay.hour(openingHour).minute(0).second(0).millisecond(0);
    let windowEnd = bookingDay.hour(closingHour).minute(0).second(0).millisecond(0);

    if (openingHour >= closingHour) {
      windowEnd = windowEnd.add(1, "day");
    }

    return { windowStart, windowEnd };
  }, [bookingDay, closingHour, openingHour]);

  const { data: overlappingBookingsData } = useQuery(JanHusBookingsDocument, {
    skip: !bookingWindow,
    variables: bookingWindow
      ? {
          startsAt: bookingWindow.windowStart.toISOString(),
          endsAt: bookingWindow.windowEnd.toISOString(),
        }
      : undefined,
    fetchPolicy: "cache-and-network",
  });

  const overlappingBookings = useMemo(() => overlappingBookingsData?.janhusBookings ?? [], [overlappingBookingsData]);

  const relevantBookings = useMemo(() => {
    const selectedArea = areas.find((candidate) => candidate.id === area);
    const conflictingAreaIds = selectedArea?.conflictingAreaIds ?? [area];
    return overlappingBookings
      .filter((booking) => conflictingAreaIds.includes(booking.area.id))
      .map((booking) => ({
        startsAt: dayjs(booking.startsAt).subtract(bufferMinutes, "minute"),
        endsAt: dayjs(booking.endsAt).add(bufferMinutes, "minute"),
      }));
  }, [area, areas, bufferMinutes, overlappingBookings]);

  const hasOverlap = useCallback(
    (start: dayjs.Dayjs, end: dayjs.Dayjs) =>
      relevantBookings.some((booking) => booking.startsAt.isBefore(end) && booking.endsAt.isAfter(start)),
    [relevantBookings]
  );

  const timeBoundaries = useMemo(() => {
    if (!bookingWindow) {
      return [];
    }

    const boundaries = [bookingWindow.windowStart];
    let current = bookingWindow.windowStart;

    while (current.add(slotGranularityMinutes, "minute").isSameOrBefore(bookingWindow.windowEnd)) {
      const next = current.add(slotGranularityMinutes, "minute");
      boundaries.push(next);
      current = next;
    }

    const lastBoundary = boundaries.at(-1);
    if (!lastBoundary?.isSame(bookingWindow.windowEnd)) {
      boundaries.push(bookingWindow.windowEnd);
    }

    return boundaries;
  }, [bookingWindow, slotGranularityMinutes]);

  const possibleEndOptionsFor = useCallback(
    (start: dayjs.Dayjs) =>
      timeBoundaries
        .filter(
          (slot) =>
            slot.isAfter(start) &&
            slot.diff(start, "minute") >= minDurationMinutes &&
            slot.diff(start, "minute") % slotGranularityMinutes === 0 &&
            !hasOverlap(start, slot)
        )
        .map((slot) => ({
          value: slot.toISOString(),
          label: formatSlotLabel(slot, bookingDay),
        })),
    [bookingDay, hasOverlap, minDurationMinutes, slotGranularityMinutes, timeBoundaries]
  );

  const startOptions = useMemo(
    () =>
      timeBoundaries
        .slice(0, -1)
        .filter((slot) => possibleEndOptionsFor(slot).length > 0)
        .map((slot) => ({
          value: slot.toISOString(),
          label: formatSlotLabel(slot, bookingDay),
        })),
    [bookingDay, possibleEndOptionsFor, timeBoundaries]
  );

  const endOptions = useMemo(
    () => (startsAt ? possibleEndOptionsFor(dayjs(startsAt)) : []),
    [startsAt, possibleEndOptionsFor]
  );

  return { startOptions, endOptions };
}
