import { ApolloError, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { BookingSemesterDocument, BookingSemesterFragment } from "@/generated/graphql";

import { DATE_FORMAT } from "@/components/Calendar/constants";

const defaultBookingSemester: BookingSemesterFragment = {
  fallStartDate: dayjs().format(DATE_FORMAT),
  fallEndDate: dayjs().format(DATE_FORMAT),
  springStartDate: dayjs().format(DATE_FORMAT),
  springEndDate: dayjs().format(DATE_FORMAT),
  fallSemesterActive: false,
  springSemesterActive: false,
};

type UseBookingSemester = {
  bookingSemester: BookingSemesterFragment;
  setBookingSemester: Dispatch<SetStateAction<BookingSemesterFragment>>;
  loading: boolean;
  error?: ApolloError;
};

/** Fetches the booking semesters from backend. */
export const useBookingSemester = (): UseBookingSemester => {
  const [bookingSemester, setBookingSemester] = useState(defaultBookingSemester);
  const { data, loading, error } = useQuery(BookingSemesterDocument);

  useEffect(() => {
    if (data?.bookingSemester) {
      setBookingSemester(data.bookingSemester);
    }
  }, [data]);

  return { bookingSemester, setBookingSemester, loading, error };
};
