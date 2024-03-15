"use client";

import { skipToken, useMutation, useQuery, useSuspenseQuery } from "@apollo/client";
import { Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";

import { useAlerts } from "@/app/components/Alerts";
import { graphql } from "@/gql/app";
import dayjs from "@/lib/date";

import { BookingDetails, BookingDetailsFields } from "./_components/BookingDetails";
import { Contract } from "./_components/Contract";
import { PickDates } from "./_components/PickDates";
import { Questions } from "./_components/Questions";
import { Summary } from "./_components/Summary";

const steps = ["Velg dato", "Kontaktinfo", "Ekstra info", "Kontrakt", "Send søknad", "Kvittering"] as const;

export default function Page() {
  const [step, setStep] = useState(0);
  const [selectedCabins, setSelectedCabins] = useState<{ id: string; name: string; capacity: number }[]>([]);
  const [dates, setDates] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [questions, setQuestions] = useState<string>("");
  const { notify } = useAlerts();

  const { data } = useSuspenseQuery(
    graphql(`
      query CabinsBookPage($calendarData: GetAvailabilityCalendarInput!) {
        cabins {
          cabins {
            id
            name
            capacity
            ...PickDates_Cabin
          }
        }
        getAvailabilityCalendar(data: $calendarData) {
          calendarMonths {
            ...PickDates_CalendarMonth
          }
        }
        user {
          user {
            id
            firstName
            lastName
            phoneNumber
            email
          }
        }
        ...Contract_Query
      }
    `),
    {
      variables: {
        calendarData: {
          count: 12,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          cabins: [],
          guests: {
            internal: 0,
            external: 0,
          },
        },
      },
    }
  );

  const [bookingDetails, setBookingDetails] = useState<BookingDetailsFields>(() => {
    if (data.user.user) {
      return {
        firstName: data.user.user.firstName,
        lastName: data.user.user.lastName,
        email: data.user.user.email,
        phone: data.user.user.phoneNumber ?? "",
        internalParticipants: 0,
        externalParticipants: 0,
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      internalParticipants: 0,
      externalParticipants: 0,
    };
  });

  const { data: getAvailabilityCalendarData, previousData } = useQuery(
    graphql(`
      query CabinsBookPage_GetAvailabilityCalendar($data: GetAvailabilityCalendarInput!) {
        getAvailabilityCalendar(data: $data) {
          calendarMonths {
            ...PickDates_CalendarMonth
          }
        }
      }
    `),
    {
      variables: {
        data: {
          count: 12,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          cabins: selectedCabins.map((cabin) => ({ id: cabin.id })),
          guests: {
            internal: bookingDetails?.internalParticipants ?? 0,
            external: bookingDetails?.externalParticipants ?? 0,
          },
        },
      },
      returnPartialData: true,
    }
  );

  const { data: totalCostData } = useSuspenseQuery(
    graphql(`
      query CabinsBookPageTotalCost($data: TotalCostInput!) {
        totalCost(data: $data) {
          totalCost
        }
      }
    `),
    dates.start && dates.end && selectedCabins.length
      ? {
          variables: {
            data: {
              startDate: dates.start.toISOString(),
              endDate: dates.end.toISOString(),
              cabins: selectedCabins.map((cabin) => ({ id: cabin.id })),
              guests: {
                internal: bookingDetails.internalParticipants,
                external: bookingDetails.externalParticipants,
              },
            },
          },
        }
      : skipToken
  );
  const totalCost = totalCostData?.totalCost.totalCost;

  const [createBooking] = useMutation(
    graphql(`
      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {
        newBooking(data: $data) {
          booking {
            id
            startDate
            endDate
            firstName
            lastName
            email
            phoneNumber
            cabins {
              id
              name
            }
            status
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({ message: "Bookingen ble sendt", type: "success" });
      },
      onError(error) {
        notify({ message: `Noe gikk galt: ${error.message}`, type: "error" });
      },
    }
  );

  function handleSelectedCabinsChanged(cabins: { id: string }[]) {
    setSelectedCabins(
      cabins.map((selected) => {
        const cabin = data.cabins.cabins.find((cabin) => cabin.id === selected.id);
        if (!cabin) throw new Error(`Cabin with id ${selected.id} not found`);
        return cabin;
      })
    );
  }

  return (
    <Stack spacing={4}>
      <Stepper activeStep={step} sx={{ display: { xs: "none", md: "flex" } }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack direction="column" alignItems="center">
        {step === 0 && (
          <PickDates
            calendarMonths={
              getAvailabilityCalendarData?.getAvailabilityCalendar.calendarMonths ??
              previousData?.getAvailabilityCalendar.calendarMonths ??
              []
            }
            selectedCabins={selectedCabins}
            onCabinsChange={handleSelectedCabinsChanged}
            onDatesChange={setDates}
            cabins={data.cabins.cabins}
            dates={dates}
          />
        )}
        {step === 1 && (
          <BookingDetails
            selectedCabins={selectedCabins}
            bookingDetails={bookingDetails}
            dates={dates}
            onSubmit={(bookingDetails) => {
              setBookingDetails(bookingDetails);
              setStep(2);
            }}
            onPrevious={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <Questions
            dates={dates}
            selectedCabins={selectedCabins}
            onSubmit={(values) => {
              setQuestions(values.extraInfo);
              setStep(3);
            }}
            onPrevious={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Contract
            selectedCabins={selectedCabins}
            dates={dates}
            bookingDetails={bookingDetails}
            price={totalCost ?? Number.NaN}
            onSubmit={() => setStep(4)}
            onPrevious={() => setStep(2)}
            query={data}
          />
        )}
        {step === 4 && (
          <Summary
            dates={dates}
            selectedCabins={selectedCabins}
            bookingDetails={bookingDetails}
            price={totalCost ?? Number.NaN}
            onPrevious={() => setStep(3)}
            onSubmit={() => {
              if (!dates.start || !dates.end) return;

              createBooking({
                variables: {
                  data: {
                    cabins: selectedCabins.map((cabin) => ({ id: cabin.id })),
                    startDate: dates.start.toISOString(),
                    endDate: dates.end.toISOString(),
                    email: bookingDetails.email,
                    firstName: bookingDetails.firstName,
                    lastName: bookingDetails.lastName,
                    phoneNumber: bookingDetails.phone,
                    internalParticipantsCount: bookingDetails.internalParticipants,
                    externalParticipantsCount: bookingDetails.externalParticipants,
                    questions,
                  },
                },
              });
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}
