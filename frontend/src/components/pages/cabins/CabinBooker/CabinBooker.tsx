import { useQuery } from "@apollo/client";
import Calendar, { CalendarEvent, createDateRange } from "@components/Calendar";
import { EventMarker } from "@components/Calendar/styles";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import useBookingRange from "@hooks/cabins/useBookingRange";
import { Cabin } from "@interfaces/cabins";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Step from "./Step";
import { BookButton, BookingContainer, Dropdown, FlowContainer, SelectContainer } from "./styles";

const DayEvent = (key: string) => <EventMarker key={key} />;

type BookState = "Choose Cabin" | "Set from date" | "Set to date" | "Book" | undefined;

interface BookingCabin extends Cabin {
  checked: boolean;
}

const CabinBooker = () => {
  const router = useRouter();
  const [activeStep, setActiveState] = useState<BookState>();
  const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
  const [bookings, setBookings] = useState<CalendarEvent[]>([]);
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [cabins, setCabins] = useState<BookingCabin[]>();

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
    setCabins(cabinQuery.data?.cabins.map((cabin) => ({ ...cabin, checked: true })));
  }, [cabinQuery.data]);

  const handleStepClick = (step: BookState) => {
    activeStep === step ? setActiveState(undefined) : setActiveState(step);
  };

  return (
    <BookingContainer>
      <FlowContainer>
        <Step
          header={"Velg Hytte"}
          isSelected={activeStep === "Choose Cabin"}
          subHeader={"Velg hvilken hytte du vil booke"}
          onClick={() => handleStepClick("Choose Cabin")}
        />

        <Step
          header={"Innsjekk"}
          isSelected={activeStep === "Set from date"}
          subHeader={range.fromDate ? range.fromDate : "Velg en dato"}
          onClick={() => handleStepClick("Set from date")}
        />

        <Step
          header={"Utsjekk"}
          isSelected={activeStep === "Set to date"}
          subHeader={range.toDate ? range.toDate : "Velg en dato"}
          onClick={() => handleStepClick("Set to date")}
        />

        <SelectContainer
          isSelected={activeStep === "Book"}
          onClick={() => {
            isAvailable
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
          {cabins?.map((cabin) => (
            <p key={cabin.name}>
              <input
                type="checkbox"
                onClick={() => {
                  setCabins(cabins.map((c) => (c.name === cabin.name ? { ...c, checked: !c.checked } : c)));
                }}
                checked={cabin.checked}
              />
              {cabin.name}
            </p>
          ))}
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
