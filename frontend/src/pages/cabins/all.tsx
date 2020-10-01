import { NextPage } from "next";
import { gql, useQuery, useMutation, DataProxy, FetchResult } from "@apollo/client";
import Calendar, { MonthView } from "react-calendar";
import { useState, FC } from "react";

interface BookingType {
    id: string;
    contactNum: number;
    contactPerson: string;
    startDay: string;
    endDay: string;
}

interface QueryVariables {
    query_variables: {
        year: string;
        month: string;
    };
}

const CabinInfo: NextPage<QueryVariables, null> = () => {
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

    const QUERY_BOOKING_RANGE = gql`
        query BookingRange($year: String, $month: String) {
            bookingsByMonth(year: $year, month: $month) {
                id
                contactNum
                contactPerson
                startDay
                endDay
            }
        }
    `;

    const CREATE_BOOKING = gql`
        mutation CreateBooking($contactNum: Int, $contactPerson: String, $endDay: String, $startDay: String) {
            createBooking(
                contactNum: $contactNum
                contactPerson: $contactPerson
                endDay: $endDay
                startDay: $startDay
            ) {
                ok
                # booking {
                #     id
                #     contactNum
                #     contactPerson
                #     startDay
                #     endDay
                # }
            }
        }
    `;

    const [query, updateQuery] = useState({
        year: "2020",
        month: "11",
    });

    const AllBookings: FC<QueryVariables> = (query_variables: QueryVariables) => {
        const { loading, error, data } = useQuery(QUERY_BOOKING_RANGE, {
            variables: query_variables.query_variables,
        });

        if (loading) return <p>Loading...</p>;

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

    const CreateBooking = () => {
        let contact_num: HTMLInputElement;
        let contact_person: HTMLInputElement;
        let start_day: HTMLInputElement;
        let end_day: HTMLInputElement;

        const [createBooking, { data }] = useMutation(CREATE_BOOKING);

        return (
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(typeof end_day.value, end_day.value);

                        createBooking({
                            variables: {
                                contactNum: parseInt(contact_num.value),
                                contactPerson: contact_person.value,
                                startDay: start_day.value,
                                endDay: end_day.value,
                            },
                        });

                        contact_num.value = "";
                        contact_person.value = "";
                        start_day.value = "";
                        end_day.value = "";

                        console.log("Booking created");
                    }}
                >
                    <div>
                        <input
                            type="number"
                            placeholder="Contact Number"
                            ref={(node) => {
                                contact_num = node as HTMLInputElement; // avoid ts-error 2322
                            }}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Contact Person"
                            ref={(node) => {
                                contact_person = node as HTMLInputElement;
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder="Start day"
                            ref={(node) => {
                                start_day = node as HTMLInputElement;
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder="End day"
                            ref={(node) => {
                                end_day = node as HTMLInputElement;
                            }}
                        />
                    </div>
                    <button type="submit">Create Booking</button>
                </form>
            </div>
        );
    };

    const RangeBooking = () => {
        let year: HTMLInputElement;
        let month: HTMLInputElement;

        return (
            <form
                onSubmit={(e) => {
                    updateQuery({
                        year: year.value,
                        month: month.value,
                    });

                    console.log(year.value, month.value);
                    e.preventDefault();
                }}
            >
                <input
                    //type="date"
                    placeholder="År"
                    ref={(node) => {
                        year = node as HTMLInputElement;
                    }}
                />

                <input
                    //type="date"
                    placeholder="Måned"
                    ref={(node) => {
                        month = node as HTMLInputElement;
                    }}
                />

                <button type="submit">Finn ledige hytter</button>
            </form>
        );
    };

    return (
        <>
            <h1>Hyttebooking</h1>
            <CreateBooking />
            <div>
                <Calendar />
            </div>

            <RangeBooking />
            <AllBookings query_variables={query} />
        </>
    );
};

export default CabinInfo;
