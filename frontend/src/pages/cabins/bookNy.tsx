import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import Link from "next/link";
import Navbar from "@components/navbar/Navbar";

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

    const handleSubmit = (e: any) => {
        // todo: run checks to see if dates are occupied or not.
        e.preventDefault();

        // must parse dates to be "YYYY-MM-DD", not "DD/MM/YYYY"
        if (fromDate && toDate) {
            fromDate = fromDate.split("/").reverse().join("-");
            toDate = toDate.split("/").reverse().join("-");
        }

        const firstname = firstnameEl.value;
        const surname = surnameEl.value;
        const email = emailEl.value;
        const phone = phoneEl.value;

        createBooking({
            variables: {
                contactNum: parseInt(phone),
                contactPerson: firstname + " " + surname,
                startDay: fromDate,
                endDay: toDate,
            },
        });
    };

    return (
        <div>
            <Navbar></Navbar>
            <h2>Booking</h2>
            <p>
                Booking fra {data.fromDate} til {data.toDate}
            </p>
            <Link href="/cabins">Tilbake</Link>
            <form action="submit" onSubmit={(e) => handleSubmit(e)}>
                <input
                    required
                    type="text"
                    placeholder="Fornavn"
                    ref={(node) => {
                        firstnameEl = node as HTMLInputElement;
                    }}
                />
                <input
                    required
                    type="text"
                    placeholder="Etternavn"
                    ref={(node) => {
                        surnameEl = node as HTMLInputElement;
                    }}
                />
                <input
                    required
                    type="email"
                    placeholder="E-postadresse"
                    ref={(node) => {
                        emailEl = node as HTMLInputElement;
                    }}
                />
                <input
                    required
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
