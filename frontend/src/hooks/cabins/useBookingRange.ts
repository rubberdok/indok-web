import { useEffect, useState } from "react";
import { QueryResult, useQuery } from "@apollo/client";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking } from "@interfaces/cabins";
import { createDateRange } from "@components/Calendar";
import moment from "moment";

interface AllBookingsQuery {
  allBookings: Booking[];
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
      const range = createDateRange(fromDate, toDate);
      setIsAvailable(
        allBookingsQuery.data.allBookings.filter(
          (booking) =>
            range.includes(booking.bookFrom) ||
            range.includes(booking.bookTo) ||
            (moment(booking.bookFrom).isBefore(moment(fromDate)) && moment(booking.bookTo).isAfter(moment(toDate))) ||
            (moment(booking.bookFrom).isAfter(moment(fromDate)) && moment(booking.bookTo).isBefore(moment(toDate)))
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
