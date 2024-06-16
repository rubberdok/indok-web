import { useMutation, useQuery } from "@apollo/client";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState } from "react";

import { BookingForm, BookingSemesterForm } from "./BookingSemesterForm";

import { Link } from "@/components";
import { BookingSemesterDocument, UpdateBookingSemesterDocument } from "@/generated/graphql";
import dayjs from "@/lib/date";

const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date: string | Date) {
  return dayjs(date).format(DATE_FORMAT);
}

function parseDate(date: string) {
  return dayjs(date, DATE_FORMAT).toDate();
}

const defaultBookingSemester: BookingForm = {
  fall: {
    start: new Date(),
    end: new Date(),
    active: false,
  },
  spring: {
    start: new Date(),
    end: new Date(),
    active: false,
  },
};

export const BookingSemesterPicker: React.FC = () => {
  const [updateBookingSemester] = useMutation(UpdateBookingSemesterDocument);
  const bookingSemester = useBookingSemester();

  const [alert, setAlert] = useState<
    | {
        severity: "success" | "error";
        message: string | React.ReactNode;
      }
    | undefined
  >(undefined);

  function handleSubmit(data: BookingForm) {
    updateBookingSemester({
      variables: {
        semesterData: {
          fallStartDate: formatDate(data.fall.start),
          fallEndDate: formatDate(data.fall.end),
          fallSemesterActive: data.fall.active,
          springStartDate: formatDate(data.spring.start),
          springEndDate: formatDate(data.spring.end),
          springSemesterActive: data.spring.active,
        },
      },
      onCompleted() {
        setAlert({
          severity: "success",
          message: "Booking-semestrene er nå oppdatert.",
        });
      },
      onError() {
        setAlert({
          severity: "error",
          message: (
            <>
              <AlertTitle>Noe gikk galt, prøv igjen senere.</AlertTitle>
              Dersom problemet vedvarer, kontakt <Link href="mailto:kontakt@rubberdok.no">kontakt@rubberdok.no</Link>
            </>
          ),
        });
      },
    });
  }

  return (
    <>
      <Snackbar open={Boolean(alert)} autoHideDuration={6000} onClose={() => setAlert(undefined)}>
        <Alert onClose={() => setAlert(undefined)} severity={alert?.severity}>
          {alert?.message}
        </Alert>
      </Snackbar>
      <BookingSemesterForm onSubmit={handleSubmit} defaultValues={defaultBookingSemester} values={bookingSemester} />
    </>
  );
};

function useBookingSemester(): BookingForm | undefined {
  const { data } = useQuery(BookingSemesterDocument);

  let values: BookingForm | undefined;
  if (data?.bookingSemester) {
    values = {
      fall: {
        start: parseDate(data.bookingSemester.fallStartDate),
        end: parseDate(data.bookingSemester.fallEndDate),
        active: data.bookingSemester.fallSemesterActive,
      },
      spring: {
        start: parseDate(data.bookingSemester.springStartDate),
        end: parseDate(data.bookingSemester.springEndDate),
        active: data.bookingSemester.springSemesterActive,
      },
    };
  }
  return values;
}
