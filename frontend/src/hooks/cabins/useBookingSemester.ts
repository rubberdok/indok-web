import { ApolloError, useQuery } from "@apollo/client";
import { BookingSemester, defaultBookingSemester } from "@components/pages/cabins/Admin/BookingSemesterPicker";
import { QUERY_BOOKING_SEMESTERS } from "@graphql/cabins/queries";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Output {
  bookingSemester: BookingSemester;
  setBookingSemester: Dispatch<SetStateAction<BookingSemester>>;
  loading: boolean;
  error?: ApolloError;
}

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
        fallSemesterActive: fallSemesterActive!,
        springSemesterActive: springSemesterActive!,
      });
    }
  }, [data]);

  return { bookingSemester, setBookingSemester, loading, error };
};

export default useBookingSemester;
