import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Calendar, { Event } from "../../components/Calendar";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { QUERY_ALL_BOOKINGS } from "../../graphql/cabins/queries";
import { Booking } from "../../lib/types/Cabins";
import _ from "lodash";
import { getDateRange } from "../../components/Calendar/helpers";
import { EventMarker } from "../../components/Calendar/styles";

interface AllBookingsQuery {
    allBookings: Booking[];
}

const DayEvent = (key: string) => <EventMarker key={key} />;

const CreateBookingPage = () => {
    const { loading, error, data } = useQuery<AllBookingsQuery>(QUERY_ALL_BOOKINGS);
    const router = useRouter();
    const [range, setRange] = useState<string[]>([]);
    const [bookings, setBookings] = useState<Event[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(true);

    useEffect(() => {
        if (data) {
            const events = data.allBookings.reduce((bookingDays, booking) => {
                const rangeOfBooking = getDateRange(moment(booking.startDay), moment(booking.endDay));
                rangeOfBooking.forEach((dayDate: string) => {
                    bookingDays.push({
                        date: dayDate,
                        renderComponent: DayEvent,
                    });
                });
                return bookingDays;
            }, [] as Event[]);
            setBookings(events);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const isConflict =
                data.allBookings.filter(
                    (booking) =>
                        _.includes(range, booking.startDay) ||
                        _.includes(range, booking.endDay) ||
                        (moment(booking.startDay).isBefore(moment(range[0])) &&
                            moment(booking.endDay).isAfter(moment(range[1]))) ||
                        (moment(booking.startDay).isAfter(moment(range[0])) &&
                            moment(booking.endDay).isBefore(moment(range[1])))
                ).length > 0;
            if (isConflict) {
                setErrorMessage("The selected calendar range is occupied by a booking");
                setIsBookButtonDisabled(true);
            } else {
                setErrorMessage("");
                setIsBookButtonDisabled(false);
            }
        }
    }, [range]);

    return (
        <div>
            <h1>Book hytte</h1>
            <Calendar rangeChanged={(range) => setRange(range)} events={bookings} />
            <button
                onClick={() => {
                    router.push({
                        pathname: "cabins/bookNy",
                        query: { fromDate: range[0], toDate: range[1] },
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
