import CreateBooking from "../../components/pages/cabins/createBooking";
import { useState } from "react";
import AllBookings from "../../components/pages/cabins/allBookings";

const CreateBookingPage = () => {
    const [query, rangeUpdate] = useState({
        year: "2020",
        month: "10",
    });

    return (
        <div>
            <CreateBooking queryVariables={query} rangeUpdate={rangeUpdate} />
            <AllBookings queryVariables={query} />
        </div>
    );
};

export default CreateBookingPage;
