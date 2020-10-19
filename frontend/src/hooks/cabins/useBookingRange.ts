import { useEffect, useState } from "react";
import { QueryResult, useQuery } from "@apollo/client";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking } from "@interfaces/cabins";
import { createDateRange } from "@components/Calendar";
import moment from "moment";
import _ from "lodash";

interface AllBookingsQuery {
    allBookings: Booking[];
}

interface Output {
    isAvailable: boolean;
    range: {
        toDate: string | undefined;
        fromDate: string | undefined;
    };
    setRange: (newFromDate: string, newToDate: string) => void;
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
                        _.includes(range, booking.startDay) ||
                        _.includes(range, booking.endDay) ||
                        (moment(booking.startDay).isBefore(moment(fromDate)) &&
                            moment(booking.endDay).isAfter(moment(toDate))) ||
                        (moment(booking.startDay).isAfter(moment(fromDate)) &&
                            moment(booking.endDay).isBefore(moment(toDate)))
                ).length === 0
            );
        } else {
            setIsAvailable(false);
        }
    }, [fromDate, toDate]);

    const setRange = (newFromDate = fromDate, newToDate = toDate) => {
        setFromDate(newFromDate);
        setToDate(newToDate);
    };

    return { isAvailable, range: { toDate, fromDate }, setRange, allBookingsQuery };
};

export default useBookingRange;
