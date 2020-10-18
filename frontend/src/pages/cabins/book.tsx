import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import Link from "next/link";
import Navbar from "@components/navbar/Navbar";
import Button from "@components/ui/Button";
import React from "react";
import Input from "@components/ui/Input";
import { SEND_EMAIL } from "@graphql/cabins/mutations";

const BookPage = () => {
    const firstnameRef = React.createRef<HTMLInputElement>();
    const surnameRef = React.createRef<HTMLInputElement>();
    const emailRef = React.createRef<HTMLInputElement>();
    const phoneRef = React.createRef<HTMLInputElement>();

    const [createBooking] = useMutation(CREATE_BOOKING);
    const [sendEmail] = useMutation(SEND_EMAIL);

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

        // avoid refs being null
        if (firstnameRef.current && surnameRef.current && emailRef.current && phoneRef.current) {
            const firstname = firstnameRef.current.value;
            const surname = surnameRef.current.value;
            const email = emailRef.current.value;
            const phone = phoneRef.current.value;

            // create booking and send email
            createBooking({
                variables: {
                    contactNum: parseInt(phone),
                    contactPerson: firstname + " " + surname,
                    startDay: fromDate,
                    endDay: toDate,
                },
            });

            sendEmail({
                variables: {
                    firstname: firstname,
                    surname: surname,
                    receiverEmail: email,
                    bookFrom: fromDate,
                    bookTo: toDate,
                },
            });

            console.log("created booking and sent email");
        }
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
                <Input placeholder="Fornavn" required={true} type="text" ref={firstnameRef}></Input>
                <Input placeholder="Etternavn" required={true} type="text" ref={surnameRef}></Input>
                <Input placeholder="E-postadresse" required={true} type="email" ref={emailRef}></Input>
                <Input placeholder="Mobilnummer" required={true} type="nummer" ref={phoneRef}></Input>
                <button type="submit">Fullfør booking</button>
                <Button url={router.asPath}>Fullfør booking</Button>
            </form>
        </div>
    );
};

export default BookPage;
