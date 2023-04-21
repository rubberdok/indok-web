import { useMutation, useQuery } from "@apollo/client";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

import { Link } from "@/components";
import { BookingSemesterDocument, UpdateBookingSemesterDocument } from "@/generated/graphql";

import { BookingForm, BookingSemesterForm } from "./BookingSemesterForm";

const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date: string | Date) {
  return dayjs(date).format(DATE_FORMAT);
}

const defaultBookingSemester: BookingForm = {
  fall: {
    start: formatDate(new Date()),
    end: formatDate(new Date()),
    active: false,
  },
  spring: {
    start: formatDate(new Date()),
    end: formatDate(new Date()),
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
      <Box>
        <BookingSemesterForm onSubmit={handleSubmit} defaultValues={defaultBookingSemester} values={bookingSemester} />
      </Box>
    </>
  );
};

function useBookingSemester(): BookingForm | undefined {
  const { data } = useQuery(BookingSemesterDocument);

  let values: BookingForm | undefined;
  if (data?.bookingSemester) {
    values = {
      fall: {
        start: data.bookingSemester.fallStartDate,
        end: data.bookingSemester.fallEndDate,
        active: data.bookingSemester.fallSemesterActive,
      },
      spring: {
        start: data.bookingSemester.springStartDate,
        end: data.bookingSemester.springEndDate,
        active: data.bookingSemester.springSemesterActive,
      },
    };
  }
  return values;
}
