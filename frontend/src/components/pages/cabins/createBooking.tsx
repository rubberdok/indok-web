import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../../graphql/cabins/mutations";
import { QueryVariables } from "../../../interfaces/cabins";
import BookingCalendar from "./bookingCalendar";
import { BookingsFor } from "./bookingsFor";

interface Props {
    queryVariables: QueryVariables;
    rangeUpdate: (variables: QueryVariables) => void;
}

const CreateBooking = ({ rangeUpdate, queryVariables }: Props) => {
    let contact_num: HTMLInputElement;
    let contact_person: HTMLInputElement;

    const [createBooking] = useMutation(CREATE_BOOKING);

    return (
        <div>
            <h1>Book hytte woho</h1>
            <BookingCalendar queryVariables={queryVariables} rangeUpdate={rangeUpdate} />
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

export default CreateBooking;
