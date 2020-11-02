import useBookingRange from "@hooks/cabins/useBookingRange";
import { useRouter } from "next/router";
import Calendar, { CalendarEvent, createDateRange } from "@components/Calendar";
import React, { useEffect, useState } from "react";
import { EventMarker } from "@components/Calendar/styles";
import { BookButton, BookingContainer, Dropdown, FlowContainer, SelectContainer } from "./styles";
import Step from "./Step";
import { from } from "@apollo/client";

const DayEvent = (key: string) => <EventMarker key={key} />;

type BookState = "Choose Cabin" | "Set from date" | "Set to date" | "Book" | undefined;

const CabinBooker = () => {
    const router = useRouter();
    const [activeStep, setActiveState] = useState<BookState>();
    const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
    const [bookings, setBookings] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(true);

    useEffect(() => {
        if (allBookingsQuery.data) {
            // Mark all occupied dates
            const events = allBookingsQuery.data.allBookings.reduce((bookingDays, booking) => {
                const rangeOfBooking = createDateRange(booking.bookFrom, booking.bookTo);
                rangeOfBooking.forEach((dayDate: string) => {
                    bookingDays.push({
                        date: dayDate,
                        renderComponent: DayEvent,
                    });
                });
                return bookingDays;
            }, [] as CalendarEvent[]);
            setBookings(events);
        }
    }, [allBookingsQuery.data]);

    useEffect(() => {
        setErrorMessage(isAvailable ? "" : "Det valgte intervallet er allerede booket");
        setIsBookButtonDisabled(!isAvailable);
    }, [isAvailable]);

    return (
        <BookingContainer>
            <FlowContainer>
                <Step
                    header={"Velg Hytte"}
                    isSelected={activeStep === "Choose Cabin"}
                    subHeader={"Velg hvilken hytte du vil booke"}
                    onClick={() => setActiveState("Choose Cabin")}
                />

                <Step
                    header={"Innsjekk"}
                    isSelected={activeStep === "Set from date"}
                    subHeader={range.fromDate ? range.fromDate : "Velg en dato"}
                    onClick={() => setActiveState("Set from date")}
                />

                <Step
                    header={"Utsjekk"}
                    isSelected={activeStep === "Set to date"}
                    subHeader={range.toDate ? range.toDate : "Velg en dato"}
                    onClick={() => setActiveState("Set to date")}
                />

                <SelectContainer
                    isSelected={activeStep === "Book"}
                    onClick={() => {
                        !isBookButtonDisabled
                            ? router.push({
                                  pathname: "cabins/book",
                                  query: range,
                              })
                            : null;
                    }}
                >
                    <BookButton>Book</BookButton>
                </SelectContainer>
            </FlowContainer>
            {activeStep == "Choose Cabin" ? (
                <Dropdown>
                    <span>
                        Begge <input type="radio" />
                    </span>
                    <span>
                        Bjørnen <input type="radio" />
                    </span>
                    <span>
                        Oksen <input type="radio" />
                    </span>
                </Dropdown>
            ) : null}
            {activeStep == "Set from date" ? (
                <Dropdown>
                    <Calendar
                        rangeChanged={(fromDate, toDate) => {
                            setRange(fromDate, toDate);
                            setActiveState("Set to date");
                        }}
                        events={bookings}
                        disableRange
                    />
                </Dropdown>
            ) : null}
            {activeStep == "Set to date" ? (
                <Dropdown>
                    <Calendar
                        initSelectedDay={range.fromDate}
                        rangeChanged={(fromDate, toDate) => {
                            setRange(fromDate, toDate);
                        }}
                        events={bookings}
                    />
                </Dropdown>
            ) : null}
        </BookingContainer>
    );
};

export default CabinBooker;
