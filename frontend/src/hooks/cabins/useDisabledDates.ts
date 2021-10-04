import { useQuery } from "@apollo/client";
import { getDateRange } from "@components/Calendar/helpers";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Cabin, PublicBooking } from "@interfaces/cabins";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Output {
  disabledDates: string[];
  setDisabledDates: Dispatch<SetStateAction<string[]>>;
}

const useDisabledDates = (chosenCabins: Cabin[]): Output => {
  const allBookingsQuery = useQuery<{
    allBookings: PublicBooking[];
  }>(QUERY_ALL_BOOKINGS);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    if (allBookingsQuery.data) {
      // Gets the bookings which should disable dates for the chosen cabins
      const chosenCabinsIDs = chosenCabins.map((cabin) => cabin.id);
      const selectedMonthBookings = allBookingsQuery.data.allBookings.filter((booking) =>
        booking.cabins.some((cabin) => chosenCabinsIDs.includes(cabin.id))
      );

      // Disable dates for the chosen cabins
      setDisabledDates(
        selectedMonthBookings.reduce((newDisabledDates: string[], booking) => {
          return newDisabledDates.concat(getDateRange(booking.checkIn, booking.checkOut));
        }, [])
      );
    }
  }, [allBookingsQuery.data, chosenCabins]);
  return { disabledDates, setDisabledDates };
};

export default useDisabledDates;
