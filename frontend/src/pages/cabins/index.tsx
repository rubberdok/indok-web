import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Calendar, { CalendarEvent, createDateRange } from "@components/Calendar";
import { EventMarker } from "@components/Calendar/styles";
import useBookingRange from "@hooks/cabins/useBookingRange";

const DayEvent = (key: string) => <EventMarker key={key} />;

const CreateBookingPage = () => {
    const router = useRouter();
    const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
    const [bookings, setBookings] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(true);

    useEffect(() => {
        if (allBookingsQuery.data) {
            // Mark all occupied dates
            const events = allBookingsQuery.data.allBookings.reduce((bookingDays, booking) => {
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
    }, [allBookingsQuery.data]);

    useEffect(() => {
        setErrorMessage(isAvailable ? "" : "Selected range is bullshit. Try again");
        setIsBookButtonDisabled(!isAvailable);
    }, [isAvailable]);

    return (
        <div>
            <h1>Book hytte</h1>
            <Calendar rangeChanged={(fromDate, toDate) => setRange(fromDate, toDate)} events={bookings} />
            <button
                onClick={() => {
                    router.push({
                        pathname: "cabins/book",
                        query: range,
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
