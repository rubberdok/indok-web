import { useMutation } from "@apollo/client";
import { getRangeLength } from "@components/Calendar";
import Navbar from "@components/navbar/Navbar";
import Button from "@components/pages/cabins/Button";
import CheckBox from "@components/pages/cabins/Checkbox";
import { HeaderComposition } from "@components/pages/cabins/HeaderCompositon";
import ImageSlider from "@components/pages/cabins/ImageSlider";
import { InputFields } from "@components/pages/cabins/InputFields";
import Summary from "@components/pages/cabins/Summary/Summary";
import { ArrowIcon } from "@components/ui/ArrowIcon";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import { ContractProps } from "@interfaces/cabins";
import { Composition } from "atomic-layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Content from "../../components/ui/Content";
import { CREATE_BOOKING } from "../../graphql/cabins/mutations";
import useBookingRange from "../../hooks/cabins/useBookingRange";

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

const BookPage: NextPage = () => {
  const firstnameRef = React.createRef<HTMLInputElement>();
  const surnameRef = React.createRef<HTMLInputElement>();
  const emailRef = React.createRef<HTMLInputElement>();
  const phoneRef = React.createRef<HTMLInputElement>();
  const inputRefs = [firstnameRef, surnameRef, emailRef, phoneRef];

  const temporarilyDisableSubmitting = false;
  const temporarilyDisableBooking = true;

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
    if (temporarilyDisableSubmitting) {
      return;
    }
    // create booking and send email, redirect to confirmation page
    if (checked && isAvailable) {
      // only create booking if allowed
      if (!temporarilyDisableBooking) {
        createBooking({
          variables: bookingData,
        });
      }

      sendEmail({
        variables: bookingData,
      });

      router.push({ pathname: "./confirmation" });

      setErrorMessage("");
      setCheckError("");
    } else {
      setErrorMessage(isAvailable ? "" : "Den valgte perioden er ikke tilgjengelig.");
      setCheckError(checked ? "" : "Du må samtykke med retningslinjene før du booker.");
    }
  };

  return (
    <Content>
      <Navbar></Navbar>
      <HeaderComposition headerText="Fullføring av booking">
        <ArrowIcon direction={"l"} size={35} href={"/cabins"}></ArrowIcon>
      </HeaderComposition>
      {isAvailable ? (
        <Composition templateXs={templatePhone} templateLg={templateDesktop} padding={15} gutter={15} gutterLg={40}>
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
                  <Button url="#" onClick={(e) => handleSubmit(e)} disabled={temporarilyDisableSubmitting}>
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
