import { useQuery } from "@apollo/client";

import { AllBookingsDocument } from "@/generated/graphql";
import dayjs from "@/lib/date";

interface BookedDatesByCar {
  [carId: string]: {
    start: string;
    end: string;
  }[];
}

export function useOverlappingBookings() {
  const { data } = useQuery(AllBookingsDocument);

  const bookedDatesByCar: BookedDatesByCar =
    data?.allBookings?.reduce<BookedDatesByCar>((bookedDates, booking) => {
      booking.cars.forEach((car) => {
        const prevBookedDatesForCar = bookedDates[car.id] ?? [];
        bookedDates[car.id] = prevBookedDatesForCar.concat({
          start: booking.checkIn,
          end: booking.checkOut,
        });
      });
      return bookedDates;
    }, {}) ?? {};

  function isDateWithOverlappingBooking(date: dayjs.Dayjs, cars: { id: string }[]) {
    return cars.some(({ id }) => isDateWithOverlappingBookingForCar(date, id));
  }

  function isDateWithOverlappingBookingForCar(date: dayjs.Dayjs, carId: string) {
    const bookings = bookedDatesByCar[carId];
    if (!bookings) {
      return false;
    }
    return bookings.some((booking) => date.isBetween(booking.start, booking.end, "day", "[]"));
  }

  function hasOverlapWithOtherBookings(dates: { start: dayjs.Dayjs; end: dayjs.Dayjs }, cars: { id: string }[]) {
    return cars.some(({ id }) => hasOverlapWithOtherBookingsForCar(dates, id));
  }

  function hasOverlapWithOtherBookingsForCar(dates: { start: dayjs.Dayjs; end: dayjs.Dayjs }, carId: string) {
    const bookings = bookedDatesByCar[carId];
    if (!bookings) {
      return false;
    }
    return bookings.some((booking) => {
      const bookingStart = dayjs(booking.start);
      const bookingEnd = dayjs(booking.end);

      return dates.start.isSameOrBefore(bookingEnd, "day") && dates.end.isSameOrAfter(bookingStart, "day");
    });
  }

  return { bookedDatesByCar, isDateWithOverlappingBooking, hasOverlapWithOtherBookings };
}
