import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

import { AllBookingsDocument } from "@/generated/graphql";

interface BookedDatesByCabin {
  [cabinId: string]: {
    start: string;
    end: string;
  }[];
}

export function useOverlappingBookings() {
  const { data } = useQuery(AllBookingsDocument);

  const bookedDatesByCabin: BookedDatesByCabin =
    data?.allBookings?.reduce<BookedDatesByCabin>((bookedDates, booking) => {
      booking.cabins.forEach((cabin) => {
        const prevBookedDatesForCabin = bookedDates[cabin.id] ?? [];
        bookedDates[cabin.id] = prevBookedDatesForCabin.concat({
          start: booking.checkIn,
          end: booking.checkOut,
        });
      });
      return bookedDates;
    }, {}) ?? {};

  function isDateWithOverlappingBooking(date: dayjs.Dayjs, cabins: { id: string }[]) {
    return cabins.some(({ id }) => isDateWithOverlappingBookingForCabin(date, id));
  }

  function isDateWithOverlappingBookingForCabin(date: dayjs.Dayjs, cabinId: string) {
    const bookings = bookedDatesByCabin[cabinId];
    if (!bookings) {
      return false;
    }
    return bookings.some((booking) => date.isBetween(booking.start, booking.end, "day", "[]"));
  }

  function hasOverlapWithOtherBookings(dates: { start: dayjs.Dayjs; end: dayjs.Dayjs }, cabins: { id: string }[]) {
    return cabins.some(({ id }) => hasOverlapWithOtherBookingsForCabin(dates, id));
  }

  function hasOverlapWithOtherBookingsForCabin(dates: { start: dayjs.Dayjs; end: dayjs.Dayjs }, cabinId: string) {
    const bookings = bookedDatesByCabin[cabinId];
    if (!bookings) {
      return false;
    }
    return bookings.some((booking) => {
      const bookingStart = dayjs(booking.start);
      const bookingEnd = dayjs(booking.end);

      return dates.start.isSameOrBefore(bookingEnd, "day") && dates.end.isSameOrAfter(bookingStart, "day");
    });
  }

  return { bookedDatesByCabin, isDateWithOverlappingBooking, hasOverlapWithOtherBookings };
}
