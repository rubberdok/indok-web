import { BookingsFor } from "../../components/pages/cabins/bookingsFor";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import { useState } from "react";
import { QueryVariables } from "../../interfaces/cabins";

interface Props {
    queryVariables: QueryVariables;
    rangeUpdate: (variables: QueryVariables) => void;
}

const BookPage = ({ queryVariables, rangeUpdate }: Props) => {
    // const [query, rangeUpdate] = useState({
    //     year: "2020",
    //     month: "10",
    //     start: "",
    //     end: "",
    // });

    console.log(queryVariables);

    let contact_num: HTMLInputElement;
    let contact_person: HTMLInputElement;

    const [createBooking] = useMutation(CREATE_BOOKING);

    return (
        <div>
            <BookingsFor queryVariables={queryVariables} />
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    // Oppdater cache
                    console.log("Making booking...");

                    createBooking({
                        variables: {
                            contactNum: parseInt(contact_num.value),
                            contactPerson: contact_person.value,
                            startDay: queryVariables.start,
                            endDay: queryVariables.end,
                        },
                    });

                    contact_num.value = "";
                    contact_person.value = "";

                    console.log("Booking created");
                }}
            >
                <div>
                    <input
                        type="number"
                        placeholder="Mobilnummer"
                        ref={(node) => {
                            contact_num = node as HTMLInputElement; // avoid ts-error 2322
                        }}
                    />
                </div>
                <div>
                    <input
                        placeholder="Fullt navn"
                        ref={(node) => {
                            contact_person = node as HTMLInputElement;
                        }}
                    />
                </div>
                <button type="submit">Book</button>
            </form>
        </div>
    );
};

export default BookPage;
