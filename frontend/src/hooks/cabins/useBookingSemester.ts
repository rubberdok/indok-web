import { ApolloError, useQuery } from "@apollo/client";
import { DATE_FORMAT } from "@components/Calendar/constants";
import { BookingSemester } from "@components/pages/cabins/Admin/BookingSemesterPicker";
import { QUERY_BOOKING_SEMESTERS } from "@graphql/cabins/queries";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Output = {
  bookingSemester: BookingSemester;
  setBookingSemester: Dispatch<SetStateAction<BookingSemester>>;
  loading: boolean;
  error?: ApolloError;
};

const defaultBookingSemester: BookingSemester = {
  fallStartDate: dayjs().format(DATE_FORMAT),
  fallEndDate: dayjs().format(DATE_FORMAT),
  springStartDate: dayjs().format(DATE_FORMAT),
  springEndDate: dayjs().format(DATE_FORMAT),
  fallSemesterActive: false,
  springSemesterActive: false,
};

/*
    Fetches the booking semesters from backend.
 */
const useBookingSemester = (): Output => {
  const [bookingSemester, setBookingSemester] = useState<BookingSemester>(defaultBookingSemester);
  const { data, loading, error } = useQuery<{ bookingSemester: BookingSemester }>(QUERY_BOOKING_SEMESTERS);

  useEffect(() => {
    if (data?.bookingSemester) {
      const { fallStartDate, fallEndDate, springStartDate, springEndDate, fallSemesterActive, springSemesterActive } =
        data.bookingSemester;
      setBookingSemester({
        fallStartDate: fallStartDate,
        fallEndDate: fallEndDate,
        springStartDate: springStartDate,
        springEndDate: springEndDate,
        fallSemesterActive: fallSemesterActive,
        springSemesterActive: springSemesterActive,
      });
    }
  }, [data]);

  return { bookingSemester, setBookingSemester, loading, error };
};

export default useBookingSemester;
