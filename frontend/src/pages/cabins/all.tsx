import { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";
import { Booking } from "../../lib/types/Cabins";

const CabinInfo: NextPage = () => {
    const QUERY_ALL_BOOKINGS = gql`
        query {
            allBookings {
                id
                contactNum
                contactPerson
                startDay
                endDay
            }
        }
    `;

    const AllBookings = () => {
        const { loading, error, data } = useQuery(QUERY_ALL_BOOKINGS);

        if (loading) return <p>Loading...</p>;

        if (error) return <p>Error :(</p>;

        return data.allBookings.map((Booking: Booking) => {
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

    return (
        <>
            <h1>Hyttebooking</h1>
            <AllBookings />
        </>
    );
};

export default CabinInfo;
