import { useEffect, useState } from "react";
import { QueryResult, useQuery } from "@apollo/client";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { PublicBooking } from "@interfaces/cabins";
import { getDateRange } from "@components/Calendar/helpers";
import dayjs from "dayjs";

interface AllBookingsQuery {
  allBookings: PublicBooking[];
}

interface Output {
  isAvailable: boolean;
  range: {
    toDate: string | undefined;
    fromDate: string | undefined;
  };
  setRange: (newFromDate: string | undefined, newToDate: string | undefined) => void;
  allBookingsQuery: QueryResult<AllBookingsQuery>;
}

const useBookingRange = (initFromDate?: string, initToDate?: string): Output => {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [isAvailable, setIsAvailable] = useState(true);
  const allBookingsQuery = useQuery<AllBookingsQuery>(QUERY_ALL_BOOKINGS);

  useEffect(() => {
    if (allBookingsQuery.data && fromDate && toDate) {
      const range = getDateRange(fromDate, toDate);
      setIsAvailable(
        allBookingsQuery.data.allBookings.filter(
          (booking) =>
            range.includes(booking.checkIn) ||
            range.includes(booking.checkOut) ||
            (dayjs(booking.checkIn).isBefore(dayjs(fromDate)) && dayjs(booking.checkOut).isAfter(dayjs(toDate))) ||
            (dayjs(booking.checkIn).isAfter(dayjs(fromDate)) && dayjs(booking.checkOut).isBefore(dayjs(toDate)))
        ).length === 0
      );
    } else {
      setIsAvailable(false);
    }
  }, [fromDate, toDate, allBookingsQuery.data]);

  const setRange = (newFromDate: string | undefined, newToDate: string | undefined) => {
    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  return { isAvailable, range: { toDate, fromDate }, setRange, allBookingsQuery };
};

export default useBookingRange;
