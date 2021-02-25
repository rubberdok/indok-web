import { useQuery } from "@apollo/client";
import Calendar, { createDateRange } from "@components/Calendar";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import useBookingRange from "@hooks/cabins/useBookingRange";
import { Cabin } from "@interfaces/cabins";
import CheckIcon from "@material-ui/icons/Check";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Step from "./Step";
import { BookingContainer, Dropdown, DropdownButton, FlowContainer, Header, SubHeader, TextContainer } from "./styles";
import { IconButton } from "@material-ui/core";

type BookState = "Choose Cabin" | "Set from date" | "Set to date" | "Book" | undefined;

interface BookingCabin extends Cabin {
  checked: boolean;
}

const CabinBooker: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveState] = useState<BookState>("Choose Cabin");
  const { isAvailable, range, setRange, allBookingsQuery } = useBookingRange();
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [cabins, setCabins] = useState<BookingCabin[]>();

  useEffect(() => {
    if (allBookingsQuery.data && cabins) {
      // Mark all occupied dates
      const occupiedDates = allBookingsQuery.data.allBookings.reduce((bookingDays, booking) => {
        const cabinIDs = getCheckedCabins().map((cabin) => cabin.id);
        const validCabin = booking.cabins.filter((cabin) => cabinIDs.includes(cabin.id));
        if (validCabin.length > 0) {
          const rangeOfBooking = createDateRange(booking.bookFrom, booking.bookTo);
          rangeOfBooking.forEach((dayDate: string) => {
            bookingDays.push(dayDate);
          });
        }
        return bookingDays;
      }, [] as string[]);
      setUnavailableDates(occupiedDates);
    }
  }, [allBookingsQuery.data, cabins]);

  useEffect(() => {
    setCabins(cabinQuery.data?.cabins.map((cabin) => ({ ...cabin, checked: true })));
  }, [cabinQuery.data]);

  const handleStepClick = (step: BookState) => {
    activeStep === step ? setActiveState(undefined) : setActiveState(step);
  };

  const getCheckedCabins = () => {
    return cabins ? cabins.filter((cabin) => cabin.checked) : [];
  };

  const getCabinSubHeader = () => {
    if (!activeStep || activeStep == "Choose Cabin") {
      return "Velg hvilken hytte du vil booke";
    } else {
      const bookedCabins = getCheckedCabins();
      return "Booker ".concat(...bookedCabins.map((cabin, i) => (i > 0 ? ` og ${cabin.name}` : cabin.name)));
    }
  };

  return (
    <BookingContainer>
      <FlowContainer>
        <Step
          header={"Velg Hytte"}
          isSelected={activeStep === "Choose Cabin"}
          subHeader={getCabinSubHeader()}
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
        <IconButton
          onClick={() => {
            isAvailable
              ? router.push({
                  pathname: "cabins/book",
                  query: {
                    ...range,
                    cabins: "".concat(
                      ...getCheckedCabins().map((cabin, i) => (i > 0 ? `_${cabin.id}` : String(cabin.id)))
                    ),
                  },
                })
              : null;
          }}
        >
          <ArrowForwardIosIcon fontSize="small" color="action" />
        </IconButton>
      </FlowContainer>
      {activeStep == "Choose Cabin" ? (
        <Dropdown small>
          {cabins?.map((cabin) => (
            <DropdownButton
              isSelected={cabin.checked}
              key={cabin.name}
              onClick={() => {
                setCabins(cabins.map((c) => (c.name === cabin.name ? { ...c, checked: !c.checked } : c)));
              }}
            >
              <TextContainer direction="center">
                <Header>{cabin.name}</Header>
                <SubHeader>Flott hytte med peis og uteterrasse. </SubHeader>
              </TextContainer>
              <TextContainer direction="right" small>
                {cabin.checked ? <CheckIcon /> : null}
              </TextContainer>
            </DropdownButton>
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
            disabledDates={unavailableDates}
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
            disabledDates={unavailableDates}
          />
        </Dropdown>
      ) : null}
    </BookingContainer>
  );
};

export default CabinBooker;
