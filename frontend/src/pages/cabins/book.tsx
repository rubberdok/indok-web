import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import Link from "next/link";
import Navbar from "@components/navbar/Navbar";
import Button from "@components/ui/Button";
import React, { useState } from "react";
import Input from "@components/ui/Input";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import { Heading, Paragraph } from "@components/ui/Typography";
import Summary from "../../components/pages/cabins/Summary";
import { Card } from "../../components/pages/cabins/Card";
import useBookingRange from "../../hooks/cabins/useBookingRange";

const BookPage = () => {
    const firstnameRef = React.createRef<HTMLInputElement>();
    const surnameRef = React.createRef<HTMLInputElement>();
    const emailRef = React.createRef<HTMLInputElement>();
    const phoneRef = React.createRef<HTMLInputElement>();

    const router = useRouter();
    const data = router.query;
    let fromDate = data.fromDate as string;
    let toDate = data.toDate as string;

    const [createBooking] = useMutation(CREATE_BOOKING);
    const [sendEmail] = useMutation(SEND_EMAIL);
    const [errorMessage, setErrorMessage] = useState("");
    const { isAvailable } = useBookingRange(fromDate, toDate);

    const handleSubmit = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

        // must parse dates to be "YYYY-MM-DD", not "DD/MM/YYYY"
        fromDate = fromDate.split("/").reverse().join("-");
        toDate = toDate.split("/").reverse().join("-");

        console.log("Klikk");
        console.log(isAvailable);

        // avoid refs being null
        if (firstnameRef.current && surnameRef.current && emailRef.current && phoneRef.current) {
            const firstname = firstnameRef.current.value;
            const surname = surnameRef.current.value;
            const email = emailRef.current.value;
            const phone = phoneRef.current.value;

            // create booking and send email

            if (isAvailable) {
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
                setErrorMessage("");

                console.log("created booking and sent email");
            } else {
                setErrorMessage("Den valgte tidsperioden er ikke tilgjengelig.");
            }
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <Heading>Fullføring av booking</Heading>
            <Link href="/cabins">Tilbake</Link>
            <Summary from={fromDate} to={toDate} cabin={"Bjørnen"} price={1299}></Summary>
            <Card>
                <Input placeholder="Fornavn" required={true} type="text" ref={firstnameRef}></Input>
                <Input placeholder="Etternavn" required={true} type="text" ref={surnameRef}></Input>
                <Input placeholder="E-postadresse" required={true} type="email" ref={emailRef}></Input>
                <Input placeholder="Mobilnummer" required={true} type="nummer" ref={phoneRef}></Input>
                <Button url="#" onClick={(e) => handleSubmit(e)}>
                    Fullfør booking
                </Button>
                <Paragraph>{errorMessage}</Paragraph>
            </Card>
        </div>
    );
};

export default BookPage;
