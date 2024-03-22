"use client";

import { skipToken, useMutation, useQuery, useSuspenseQuery } from "@apollo/client";
import { Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";

import { useAlerts } from "@/app/components/Alerts";
import { graphql } from "@/gql/app";
import dayjs from "@/lib/date";

import { BookingDetails, BookingDetailsFields } from "./_components/BookingDetails";
import { Contract } from "./_components/BookingTerms";
import { PickDates } from "./_components/PickDates";
import { Questions } from "./_components/Questions";
import { Summary } from "./_components/Summary";
import { useBookingSearchParams } from "./useBookingSearchParams";
import { useRouter } from "next/navigation";

const steps = ["Velg dato", "Kontaktinfo", "Ekstra info", "Bestillingsvilkår", "Send søknad", "Kvittering"] as const;

export default function Page() {
  const { checkIn, checkOut, selectedCabins, onBookingChange } = useBookingSearchParams();

  const [step, setStep] = useState(0);

  const [questions, setQuestions] = useState<string>("");
  const { notify } = useAlerts();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    graphql(`
      query CabinsBookPage($calendarData: GetAvailabilityCalendarInput!) {
        cabins {
          cabins {
            id
            name
            capacity
            ...PickDates_Cabin
            ...BookingDetails_Cabin
            ...Summary_Cabin
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
        ...BookingTerms_Query
      }
    `),
    {
      variables: {
        calendarData: {
          count: 12,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          cabins: selectedCabins.map((id) => ({ id })),
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
          cabins: selectedCabins?.map((id) => ({ id })) ?? [],
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
    checkIn && checkOut && selectedCabins?.length
      ? {
          variables: {
            data: {
              startDate: checkIn.toISOString(),
              endDate: checkOut.toISOString(),
              cabins: selectedCabins.map((id) => ({ id })),
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
      onCompleted({ newBooking }) {
        notify({ message: "Bookingen ble sendt", type: "success" });
        router.push(`/cabins/bookings/${newBooking.booking.id}/?email=${newBooking.booking.email}`);
      },
      onError(error) {
        notify({ message: `Noe gikk galt: ${error.message}`, type: "error" });
      },
    }
  );

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
            onCabinsChange={(cabins) => {
              onBookingChange({
                cabins,
                checkIn: checkIn?.toISOString(),
                checkOut: checkOut?.toISOString(),
              });
            }}
            onDatesChange={({ start, end }) => {
              onBookingChange({ cabins: selectedCabins, checkIn: start?.toISOString(), checkOut: end?.toISOString() });
            }}
            cabins={data.cabins.cabins}
            dates={{ end: checkOut, start: checkIn }}
            onSubmit={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <BookingDetails
            bookingDetails={bookingDetails}
            cabins={data.cabins.cabins}
            onSubmit={(bookingDetails) => {
              setBookingDetails(bookingDetails);
              setStep(2);
            }}
            onPrevious={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <Questions
            onSubmit={(values) => {
              setQuestions(values.extraInfo);
              setStep(3);
            }}
            onPrevious={() => setStep(1)}
          />
        )}
        {step === 3 && <Contract onSubmit={() => setStep(4)} onPrevious={() => setStep(2)} query={data} />}
        {step === 4 && (
          <Summary
            cabins={data.cabins.cabins}
            bookingDetails={bookingDetails}
            price={totalCost ?? Number.NaN}
            onPrevious={() => setStep(3)}
            onSubmit={() => {
              if (!checkIn || !checkOut) return;

              createBooking({
                variables: {
                  data: {
                    cabins: selectedCabins.map((id) => ({ id })),
                    startDate: checkIn.toISOString(),
                    endDate: checkOut.toISOString(),
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
