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
import Summary from "@components/pages/cabins/Summary/Summary";
import { getRangeLength } from "@components/Calendar";
import { HeaderComposition } from "@components/pages/cabins/HeaderCompositon";
import CheckBox from "@components/pages/cabins/Checkbox";
import Button from "@components/pages/cabins/Button";
import ImageSlider from "@components/pages/cabins/ImageSlider";
import { ContractProps } from "@interfaces/cabins";
import styled from "styled-components";

interface BookingData {
    firstname: string;
    surname: string;
    receiverEmail: string;
    phone: number;
    bookFrom: string;
    bookTo: string;
    cabin: string;
    price: number;
}

const BookPage = (): JSX.Element => {
    const firstnameRef = React.createRef<HTMLInputElement>();
    const surnameRef = React.createRef<HTMLInputElement>();
    const emailRef = React.createRef<HTMLInputElement>();
    const phoneRef = React.createRef<HTMLInputElement>();
    const inputRefs = [firstnameRef, surnameRef, emailRef, phoneRef];

    const pricePerNight = 1000;

    const templateDesktop = `
        sum slider
        inputs slider
        / 1fr 1fr
    `;

    const templatePhone = `
        slider
        sum
        inputs
    `;

    const router = useRouter();
    const data = router.query;

    const [contractData, setContractData] = useState({} as ContractProps);
    const [bookingData, setBookingData] = useState({} as BookingData);
    const [rangeLength, setRangeLength] = useState(0);
    const [createBooking] = useMutation(CREATE_BOOKING);
    const [sendEmail] = useMutation(SEND_EMAIL);
    const [errorMessage, setErrorMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [checkerror, setCheckError] = useState("");
    const [checkable, setCheckable] = useState(false);
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

    const handleInputChange = () => {
        // update checkbox
        const checklist = inputRefs.filter((ref) => {
            if (ref.current?.value) {
                if (ref.current?.value.length > 0) {
                    return 1;
                }
            }
        });

        setCheckable(checklist.length == 4 ? true : false);

        // update input data
        const updatedBookingData: BookingData = {
            firstname: firstnameRef.current?.value as string,
            surname: surnameRef.current?.value as string,
            phone: parseInt(phoneRef.current?.value as string),
            receiverEmail: emailRef.current?.value as string,
            bookFrom: range.fromDate as string,
            bookTo: range.toDate as string,
            cabin: "Bjørnen",
            price: rangeLength * pricePerNight,
        };

        setBookingData(updatedBookingData);

        // update contract data state
        const updatedContractData = {
            firstname: updatedBookingData.firstname,
            surname: updatedBookingData.surname,
            fromDate: updatedBookingData.bookFrom,
            toDate: updatedBookingData.bookTo,
            cabin: updatedBookingData.cabin,
            price: updatedBookingData.price,
        };

        setContractData({ contractData: updatedContractData });
    };

    const handleSubmit = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();

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
    };

    const tempHandleSubmit = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();
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
                    {({ Inputs, Sum, Slider }) => (
                        <>
                            <Inputs>
                                <InputFields refs={inputRefs} onChange={handleInputChange}>
                                    <CheckBox
                                        checked={checked}
                                        onClick={handleClick}
                                        errorMsg={checkerror}
                                        checkable={checkable}
                                        contractData={contractData}
                                    ></CheckBox>
                                    <Button url="#" onClick={(e) => tempHandleSubmit(e)} disabled>
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
                            <Slider>
                                <ImageSlider cabin="Bjørnen"></ImageSlider>
                            </Slider>
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
