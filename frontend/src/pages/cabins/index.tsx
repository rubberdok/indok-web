import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Calendar, { CalendarEvent, createDateRange } from "@components/Calendar";
import { EventMarker } from "@components/Calendar/styles";
import Navbar from "@components/navbar/Navbar";
import useBookingRange from "../../hooks/cabins/useBookingRange";
import styled from "styled-components";

const DayEvent = (key: string) => <EventMarker key={key} />;

const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 800px;
`;

const BookingContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Dropdown = styled.div`
    flex-direction: column;
    background-color: white;
    margin: 15px;
    padding: 12px 16px;
    z-index: 1;
    border-radius: 30px;
`;

const FlowContainer = styled.div`
    display: flex;
    width: 800px;
    height: 60px;
    background-color: white;
    margin-top: 20px;
    border-radius: 30px;
`;

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    height: 100%;
    &:hover {
        cursor: pointer;
        background-color: gray;
        color: white;
    }
    border-radius: 30px;
    text-align: center;
    padding-top: 15px;
`;

const Header = styled.div`
    text-align: center;
    font-weight: 700;
    font-size: 14px;
`;
const SubHeader = styled.div`
    font-weight: 400;
    font-size: 10px;
    padding-left: 5px;
`;

const BookButton = styled.div`
    background-color: black;
    color: white;
    border-radius: 25px;
    width: 70%;
`;

const Flow = ({ header, subHeader, onClick }: { header: string; subHeader: string; onClick: () => void }) => (
    <SelectContainer onClick={onClick}>
        <Header>{header}</Header>
        <SubHeader>{subHeader}</SubHeader>
    </SelectContainer>
);

const CreateBookingPage = () => {
    const router = useRouter();
    const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
    const [bookings, setBookings] = useState<CalendarEvent[]>([]);
    const [showDropdown, setShowDropdown] = useState({ cabin: false, calendar: false });
    const [errorMessage, setErrorMessage] = useState("");
    const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(true);

    useEffect(() => {
        if (allBookingsQuery.data) {
            // Mark all occupied dates
            const events = allBookingsQuery.data.allBookings.reduce((bookingDays, booking) => {
                const rangeOfBooking = createDateRange(booking.startDay, booking.endDay);
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
        setErrorMessage(isAvailable ? "" : "Selected range is bullshit. Try again");
        setIsBookButtonDisabled(!isAvailable);
    }, [isAvailable]);

    return (
        <div>
            <Navbar />
            <Container>
                <BookingContainer>
                    <FlowContainer>
                        <Flow
                            header={"Velg Hytte"}
                            subHeader={"Velg hvilken hytte du vil booke"}
                            onClick={() => setShowDropdown((prev) => ({ ...prev, cabin: !prev.cabin }))}
                        />

                        <Flow
                            header={"Innsjekk"}
                            subHeader={range.fromDate ? range.fromDate : "Velg en dato"}
                            onClick={() => setShowDropdown((prev) => ({ ...prev, calendar: !prev.calendar }))}
                        />

                        <Flow
                            header={"Utsjekk"}
                            subHeader={range.toDate ? range.toDate : "Velg en dato"}
                            onClick={() => setShowDropdown((prev) => ({ ...prev, calendar: !prev.calendar }))}
                        />
                        <SelectContainer
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
                    {showDropdown.cabin ? (
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
                    {showDropdown.calendar ? (
                        <Dropdown>
                            <p>{errorMessage}</p>
                            <Calendar
                                rangeChanged={(fromDate, toDate) => setRange(fromDate, toDate)}
                                events={bookings}
                            />
                        </Dropdown>
                    ) : null}
                </BookingContainer>
            </Container>
        </div>
    );
};

export default CreateBookingPage;
