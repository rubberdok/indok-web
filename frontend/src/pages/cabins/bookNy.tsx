import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";

const BookPage = () => {
    let firstnameEl: HTMLInputElement;
    let surnameEl: HTMLInputElement;
    let emailEl: HTMLInputElement;
    let phoneEl: HTMLInputElement;

    const [createBooking] = useMutation(CREATE_BOOKING);

    const router = useRouter();
    const data = router.query;
    let fromDate = data.fromDate;
    let toDate = data.toDate;
    console.log(data);

    const handleSubmit = (e: any) => {
        // todo: run checks to see if dates are occupied or not.
        e.preventDefault();

        // must parse dates to be "YYYY-MM-DD"

        fromDate = fromDate.split("/").reverse().join("-");
        toDate = toDate.split("/").reverse().join("-");

        const firstname = firstnameEl.value;
        const surname = surnameEl.value;
        const email = emailEl.value;
        const phone = phoneEl.value;
        console.log("dates");
        console.log(fromDate);
        console.log(toDate);

        createBooking({
            variables: {
                contactNum: parseInt(phone),
                contactPerson: firstname + " " + surname,
                startDay: fromDate,
                endDay: toDate,
            },
        });

        console.log("booking created");
    };

    return (
        <div>
            <h2>Booking</h2>
            <p>
                Booking fra {data.fromDate} til {data.toDate}
            </p>
            <form action="submit" onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    placeholder="Fornavn"
                    ref={(node) => {
                        firstnameEl = node as HTMLInputElement;
                    }}
                />
                <input
                    type="text"
                    placeholder="Etternavn"
                    ref={(node) => {
                        surnameEl = node as HTMLInputElement;
                    }}
                />
                <input
                    type="email"
                    placeholder="E-postadresse"
                    ref={(node) => {
                        emailEl = node as HTMLInputElement;
                    }}
                />
                <input
                    type="number"
                    placeholder="Mobilnummer"
                    ref={(node) => {
                        phoneEl = node as HTMLInputElement;
                    }}
                />
                <button type="submit">Fullfør booking</button>
            </form>
        </div>
    );
};

export default BookPage;
