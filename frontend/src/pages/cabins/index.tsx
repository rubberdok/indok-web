import { useState } from "react";

import { useRouter } from "next/router";
import Calendar from "../../components/Calendar/index";
import Button from "@components/ui/Button";
import Navbar from "@components/navbar/Navbar";
import { useQuery } from "@apollo/client";
import { QUERY_BOOKING_RANGE } from "@graphql/cabins/queries";
import { QUERY_ALL_BOOKINGS } from "../../graphql/cabins/queries";

interface BookingFromTo {
    from: Date;
    to: Date;
}

const CreateBookingPage = () => {
    const [range, rangeChange] = useState({
        from: new Date(1, 1, 2020),
        to: new Date(2, 1, 2020),
    });

    const router = useRouter();

    let fromEl: HTMLInputElement;
    let toEl: HTMLInputElement;
    let outputEl: HTMLElement;

    const { loading, data } = useQuery(QUERY_ALL_BOOKINGS);

    // parse all bookings data

    let parsedBookings: BookingFromTo[];
    if (!loading) {
        parsedBookings = data.allBookings.map((booking: any) => {
            const from: number[] = booking.startDay.split("-").map((date: string) => parseInt(date));
            const to: number[] = booking.endDay.split("-").map((date: string) => parseInt(date));
            const fromDate = new Date(from[0], from[1] - 1, from[2]);
            const toDate = new Date(to[0], to[1] - 1, to[2]);

            return {
                from: fromDate,
                to: toDate,
            };
        });

        console.log(parsedBookings);
    }

    return (
        <div>
            <Navbar></Navbar>
            <h1>Book hytte</h1>
            {/* <BookingCalendar queryVariables={query} rangeUpdate={rangeUpdate} /> */}
            {/* send videre med parametre onsubmit */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const from = fromEl.value.split("-").map((n) => parseInt(n));
                    const to = toEl.value.split("-").map((n) => parseInt(n));
                    const fromDate = new Date(from[0], from[1] - 1, from[2]);
                    const toDate = new Date(to[0], to[1] - 1, to[2]);

                    // run check to see if booking is occupied
                    let occupied = false;
                    let occupiedByString: string[] = [];
                    parsedBookings.forEach((booking) => {
                        if (
                            (fromDate >= booking.from && fromDate <= booking.to) || // fromDate inside booking range
                            (toDate >= booking.from && toDate <= booking.to) || // toDate inside booking range
                            (fromDate <= booking.from && toDate >= booking.to) // both fromDate and toDate outside of booking range (booking range inside range(from, to))
                        ) {
                            occupied = true;
                            occupiedByString = [booking.from.toLocaleDateString(), booking.to.toLocaleDateString()];
                        }
                    });

                    if (occupied) {
                        const fromString = fromDate.toLocaleDateString();
                        const toString = toDate.toLocaleDateString();
                        outputEl.innerHTML = `Booking fra ${fromString} til ${toString} er allerede booket fra \n`;
                        outputEl.innerHTML += `${occupiedByString[0]} til ${occupiedByString[1]}`;
                    } else {
                        // updates state and redirects to book page with query fromDate and toDate
                        outputEl.innerHTML = "";
                        rangeChange({
                            from: fromDate,
                            to: toDate,
                        });

                        router.push({
                            pathname: "cabins/bookNy",
                            query: { fromDate: fromDate.toLocaleDateString(), toDate: toDate.toLocaleDateString() },
                        });
                    }
                }}
            >
                <input
                    type="date"
                    placeholder="Fra"
                    ref={(node) => {
                        fromEl = node as HTMLInputElement;
                    }}
                />

                <input
                    type="date"
                    placeholder="Til"
                    ref={(node) => {
                        toEl = node as HTMLInputElement;
                    }}
                />

                <button type="submit">Book</button>
                <p
                    ref={(node) => {
                        outputEl = node as HTMLElement;
                    }}
                ></p>
                <Button url="#">Book</Button>
            </form>
        </div>
    );
};

export default CreateBookingPage;
