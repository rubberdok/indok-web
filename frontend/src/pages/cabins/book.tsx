import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import Link from "next/link";
import Navbar from "@components/navbar/Navbar";
import Button from "@components/ui/Button";
import React, { useEffect, useState } from "react";
import Input from "@components/ui/Input";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import { Heading, Paragraph } from "@components/ui/Typography";
import { Card } from "../../components/pages/cabins/Card";
import useBookingRange from "../../hooks/cabins/useBookingRange";
import Content from "../../components/ui/Content";
import { InputFields } from "@components/pages/cabins/InputFields";
import { Composition } from "atomic-layout";
import Summary from "@components/pages/cabins/Summary";
import moment from "moment";
import { getRangeLength } from "@components/Calendar";

const BookPage = (): JSX.Element => {
    const firstnameRef = React.createRef<HTMLInputElement>();
    const surnameRef = React.createRef<HTMLInputElement>();
    const emailRef = React.createRef<HTMLInputElement>();
    const phoneRef = React.createRef<HTMLInputElement>();
    const inputRefs = [firstnameRef, surnameRef, emailRef, phoneRef];

    const router = useRouter();
    const data = router.query;
    let fromDate = data.fromDate as string;
    let toDate = data.toDate as string;
    const pricePerNight = 1000;
    const rangeLength = getRangeLength(fromDate, toDate);

    const [createBooking] = useMutation(CREATE_BOOKING);
    const [sendEmail] = useMutation(SEND_EMAIL);
    const [errorMessage, setErrorMessage] = useState("");

    const templateMobile = `
        inputfields summary
    `;

    const templateTablet = `
        inputfields
        summary
    `;

    const handleSubmit = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

        // must parse dates to be "YYYY-MM-DD", not "DD/MM/YYYY"
        fromDate = fromDate.split("/").reverse().join("-");
        toDate = toDate.split("/").reverse().join("-");

        // avoid refs being null
        if (firstnameRef.current && surnameRef.current && emailRef.current && phoneRef.current) {
            const firstname = firstnameRef.current.value;
            const surname = surnameRef.current.value;
            const email = emailRef.current.value;
            const phone = phoneRef.current.value;

            // create booking and send email

            if (firstname) {
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
                console.log("Ikke tilgjengelig.");
            }
        }
    };

    return (
        <Content>
            <Navbar></Navbar>
            <Heading>Fullføring av booking</Heading>
            <Link href="/cabins">Tilbake</Link>
            <Composition templateMd={templateTablet} templateLg={templateMobile} padding={15} gutter={15} gutterLg={40}>
                {() => (
                    <>
                        <InputFields refs={inputRefs}>
                            <Button url="#" onClick={(e) => handleSubmit(e)}>
                                Gå til betaling
                            </Button>
                        </InputFields>
                        <Summary
                            from={fromDate}
                            to={toDate}
                            cabin={"Bjørnen"}
                            price={pricePerNight}
                            nights={rangeLength}
                        ></Summary>
                    </>
                )}
            </Composition>
        </Content>
    );
};

export default BookPage;
