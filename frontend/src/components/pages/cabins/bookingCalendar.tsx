import Calendar from "react-calendar";
import { QueryVariables, BookingType } from "../../../interfaces/cabins";
import { useQuery } from "@apollo/client";
import { QUERY_BOOKING_RANGE } from "../../../graphql/cabins/queries";

// proposition

interface Props {
    queryVariables: QueryVariables;
    rangeUpdate: (variables: QueryVariables) => void;
}

const BookingCalendar = ({ rangeUpdate, queryVariables }: Props) => {
    const { loading, error, data } = useQuery(QUERY_BOOKING_RANGE, {
        variables: queryVariables,
    });

    if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error</p>;

    return (
        <div>
            <Calendar
                selectRange={true}
                showWeekNumbers={true}
                tileDisabled={({ activeStartDate, date, view }) => {
                    const bookedDates = data.bookingsByMonth.map((Booking: BookingType) => {
                        const startDate = parseInt(Booking.startDay.split("-")[2]);
                        const endDate = parseInt(Booking.endDay.split("-")[2]);
                        //console.log("start, end", startDate, endDate);

                        const bookedRange = [];
                        for (let i = startDate; i <= endDate; i += 1) {
                            bookedRange.push(i);
                        }

                        return [...bookedRange];
                    });

                    const booked: number[] = [];
                    bookedDates.forEach((list: number[]) => {
                        booked.push(...list);
                    });

                    return booked.includes(date.getDate());
                }}
                onActiveStartDateChange={(e) => {
                    const startdate = e.activeStartDate;
                    console.log("onactivechange", startdate);
                    rangeUpdate({
                        year: startdate.getFullYear().toString(),
                        month: (startdate.getMonth() + 1).toString(),
                        start: "",
                        end: "",
                    });
                }}
                onChange={(e) => {
                    const range = e.toLocaleString();
                    const start_date = range.split(",")[0];
                    const end_date = range.split(",")[2];

                    console.log(e, start_date, end_date);

                    const start = start_date.split("/");
                    const start_day = start[0];
                    const start_month = start[1];
                    const start_year = start[2];

                    const end = end_date.split("/");
                    const end_day = end[0];
                    const end_month = end[1];
                    const end_year = end[2];

                    const updateStart = [start_year, start_month, start_day].join("-");
                    const updateEnd = [end_year, end_month, end_day].join("-");

                    console.log("onchange", e.toLocaleString());

                    rangeUpdate({
                        year: start_year,
                        month: start_month,
                        start: updateStart,
                        end: updateEnd,
                    });
                }}
            />
        </div>
    );
};
export default BookingCalendar;
