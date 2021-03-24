import { useQuery } from "@apollo/client";
import { getDateRange } from "@components/Calendar/helpers";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking, Cabin } from "@interfaces/cabins";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Output {
  disabledDates: string[];
  setDisabledDates: Dispatch<SetStateAction<string[]>>;
}

const useDisabledDates = (chosenCabins: Cabin[]): Output => {
  const allBookingsQuery = useQuery<{
    allBookings: Booking[];
  }>(QUERY_ALL_BOOKINGS);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    if (allBookingsQuery.data) {
      const selectedMonthBookings = allBookingsQuery.data.allBookings.filter((booking) => {
        return booking.cabins.some((cabin) => chosenCabins.map((cabin) => cabin.id).includes(cabin.id));
      });
      setDisabledDates(
        selectedMonthBookings.reduce((newDisabledDates, booking) => {
          return newDisabledDates.concat(getDateRange(booking.checkIn, booking.checkOut));
        }, [] as string[])
      );
    }
  }, [allBookingsQuery.data, chosenCabins]);
  return { disabledDates, setDisabledDates };
};

export default useDisabledDates;
