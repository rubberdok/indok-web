import Link from "next/link";
import Calendar from "react-calendar";
import AllBookings from "../../components/pages/cabins/allBookings";
import { useState } from "react";
import CreateBooking from "../../components/pages/cabins/createBooking";
import { RangeBooking } from "../../components/pages/cabins/rangeBooking";
import { BookingsFor } from "../../components/pages/cabins/bookingsFor";

const Bookings = () => {
    const [query, updateQuery] = useState({
        year: "2020",
        month: "11",
    });

    // console.log(updateQuery)
    // updateQuery({
    //      year: "2001",
    //      month: "01",
    // })

    return (
        <div>
            <RangeBooking range_update={updateQuery} />
            <BookingsFor queryVariables={query} />
            <AllBookings queryVariables={query} />
            <Link href="/cabins/">Go home</Link>
            <Calendar onChange={(date) => console.log(date)} />
        </div>
    );
};
export default Bookings;
