import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import Navbar from "@components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import useBookingRange from "../../hooks/cabins/useBookingRange";
import Content from "../../components/ui/Content";
import { InputFields } from "@components/pages/cabins/InputFields";
import { Composition } from "atomic-layout";
import Summary from "@components/pages/cabins/Summary";
import { getRangeLength } from "@components/Calendar";
import { HeaderComposition } from "@components/pages/cabins/HeaderCompositon";
import CheckBox from "@components/pages/cabins/Checkbox";
import Button from "@components/pages/cabins/Button";

const BookPage = (): JSX.Element => {
    const firstnameRef = React.createRef<HTMLInputElement>();
    const surnameRef = React.createRef<HTMLInputElement>();
    const emailRef = React.createRef<HTMLInputElement>();
    const phoneRef = React.createRef<HTMLInputElement>();
    const inputRefs = [firstnameRef, surnameRef, emailRef, phoneRef];

    const pricePerNight = 1000;

    const templateDesktop = `
        inputs sum
        / 1fr 1fr
    `;

    const templatePhone = `
        sum
        inputs
    `;

    const router = useRouter();
    const data = router.query;

    const [rangeLength, setRangeLength] = useState(0);
    const [createBooking] = useMutation(CREATE_BOOKING);
    const [sendEmail] = useMutation(SEND_EMAIL);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [checkerror, setCheckError] = useState("");
    const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();

    const handleClick = () => {
        setChecked(!checked);
        setCheckError("");
    };

    useEffect(() => {
        if (data.fromDate && data.toDate) {
            const fromDate = data.fromDate as string;
            const fromDateParsed = fromDate.split("/").reverse().join("-");
            const toDate = data.toDate as string;
            const toDateParsed = toDate.split("/").reverse().join("-");
            setRange(fromDateParsed, toDateParsed);
            setRangeLength(getRangeLength(fromDate, toDate));
        }
    }, [data]);

    useEffect(() => {
        setErrorMessage(isAvailable ? "" : "Den valgte perioden er ikke tilgjengelig.");
    }, [isAvailable]);

    const handleSubmit = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

        // avoid refs being null
        if (firstnameRef.current && surnameRef.current && emailRef.current && phoneRef.current) {
            const bookingData = {
                firstname: firstnameRef.current.value,
                surname: surnameRef.current.value,
                phone: phoneRef.current.value,
                receiverEmail: emailRef.current.value,
                bookFrom: range.fromDate,
                bookTo: range.toDate,
                price: pricePerNight * rangeLength,
            };

            // create booking and send email
            if (checked && isAvailable) {
                createBooking({
                    variables: bookingData,
                });

                sendEmail({
                    variables: bookingData,
                });

                setErrorMessage("");
                setCheckError("");
            } else {
                setErrorMessage(isAvailable ? "" : "Den valgte perioden er ikke tilgjengelig.");
                setCheckError(checked ? "" : "Du må samtykke med retningslinjene før du booker.");
            }
        }
    };

    return (
        <Content>
            <Navbar></Navbar>
            <HeaderComposition></HeaderComposition>
            {isAvailable ? (
                <Composition
                    templateXs={templatePhone}
                    templateLg={templateDesktop}
                    padding={15}
                    gutter={15}
                    gutterLg={40}
                >
                    {({ Inputs, Sum }) => (
                        <>
                            <Inputs>
                                <InputFields refs={inputRefs}>
                                    <CheckBox checked={checked} onClick={handleClick} errorMsg={checkerror}></CheckBox>
                                    <Button url="#" onClick={(e) => handleSubmit(e)}>
                                        Gå til betaling
                                    </Button>
                                </InputFields>
                            </Inputs>
                            <Sum>
                                <Summary
                                    from={range.fromDate ? range.fromDate : ""}
                                    to={range.toDate ? range.toDate : ""}
                                    cabin={"Bjørnen"}
                                    price={pricePerNight}
                                    nights={rangeLength}
                                ></Summary>
                            </Sum>
                        </>
                    )}
                </Composition>
            ) : (
                <>{allBookingsQuery.loading ? <p>Laster...</p> : <p>{errorMessage}</p>}</>
            )}
        </Content>
    );
};

export default BookPage;
