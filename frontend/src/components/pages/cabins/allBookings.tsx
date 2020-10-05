import { useQuery } from "@apollo/client";
import { QueryVariables, BookingType } from "../../../interfaces/cabins";
import { QUERY_BOOKING_RANGE } from "../../../graphql/cabins/queries";
import { FC } from "react";

interface Props {
    queryVariables: QueryVariables;
}

const AllBookings: FC<Props> = ({ queryVariables }) => {
    const { loading, error, data } = useQuery(QUERY_BOOKING_RANGE, {
        variables: queryVariables,
    });

    if (loading) return <p>Loading...</p>;

    if (!queryVariables.month || !queryVariables.month) return <p>Vennligst fyll inn begge feltene</p>;

    if (error) return <p>Error :(</p>;

    if (data.bookingsByMonth.length == 0) {
        return (
            <div>
                <p>Ingen ledige bookinger</p>
            </div>
        );
    }

    return data.bookingsByMonth.map((Booking: BookingType) => {
        return (
            <div key={Booking.id}>
                <h3>Booking #{Booking.id}: </h3>
                <h4>
                    {Booking.startDay} to {Booking.endDay} by {Booking.contactPerson}
                </h4>
                <p>Contact: {Booking.contactNum}</p>
            </div>
        );
    });
};

export default AllBookings;
