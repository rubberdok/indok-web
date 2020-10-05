import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../../graphql/cabins/mutations";

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

export default CreateBooking;
