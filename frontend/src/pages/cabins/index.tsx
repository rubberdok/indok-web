import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Calendar, { CalendarEvent, createDateRange } from "../../components/Calendar";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { QUERY_ALL_BOOKINGS } from "../../graphql/cabins/queries";
import { Booking } from "../../lib/types/Cabins";
import _ from "lodash";
import { EventMarker } from "../../components/Calendar/styles";
import Navbar from "@components/navbar/Navbar";

interface AllBookingsQuery {
    allBookings: Booking[];
}

const DayEvent = (key: string) => <EventMarker key={key} />;

const CreateBookingPage = () => {
    const { loading, error, data } = useQuery<AllBookingsQuery>(QUERY_ALL_BOOKINGS);
    const router = useRouter();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [bookings, setBookings] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(true);

    useEffect(() => {
        if (data) {
            const events = data.allBookings.reduce((bookingDays, booking) => {
                const rangeOfBooking = createDateRange(booking.startDay, booking.endDay);
                rangeOfBooking.forEach((dayDate: string) => {
                    bookingDays.push({
                        date: dayDate,
                        renderComponent: DayEvent,
                    });
                });
                return bookingDays;
            }, [] as CalendarEvent[]);
            setBookings(events);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const range = createDateRange(fromDate, toDate);
            const isConflict =
                data.allBookings.filter(
                    (booking) =>
                        _.includes(range, booking.startDay) ||
                        _.includes(range, booking.endDay) ||
                        (moment(booking.startDay).isBefore(moment(fromDate)) &&
                            moment(booking.endDay).isAfter(moment(toDate))) ||
                        (moment(booking.startDay).isAfter(moment(fromDate)) &&
                            moment(booking.endDay).isBefore(moment(toDate)))
                ).length > 0;
            if (isConflict) {
                setErrorMessage("The selected calendar range is occupied by a booking");
                setIsBookButtonDisabled(true);
            } else {
                setErrorMessage("");
                setIsBookButtonDisabled(false);
            }
        }
    }, [fromDate, toDate]);

    return (
        <div>
            <Navbar />
            <h1>Book hytte</h1>
            <Calendar
                rangeChanged={(fromDate, toDate) => {
                    setFromDate(fromDate);
                    setToDate(toDate);
                }}
                events={bookings}
            />
            <button
                onClick={() => {
                    router.push({
                        pathname: "cabins/book",
                        query: { fromDate, toDate },
                    });
                }}
                disabled={isBookButtonDisabled}
            >
                Book
            </button>
            <p>{errorMessage}</p>
        </div>
    );
};

export default CreateBookingPage;
