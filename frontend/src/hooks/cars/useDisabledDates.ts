import { useQuery } from "@apollo/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { getDateRange } from "@/components/Calendar/helpers";
import { AllCarBookingsDocument, CarFragment } from "@/generated/graphql";

type Output = {
  disabledDates: string[];
  setDisabledDates: Dispatch<SetStateAction<string[]>>;
};

export const useDisabledDates = (chosenCars: CarFragment[]): Output => {
  const allCarBookingsQuery = useQuery(AllCarBookingsDocument);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    if (allCarBookingsQuery.data?.allCarBookings) {
      // Gets the bookings which should disable dates for the chosen cars
      const chosenCarsIDs = chosenCars.map((car) => car.id);
      const selectedMonthBookings = allCarBookingsQuery.data.allCarBookings.filter((booking) =>
        booking.cars.some((car) => chosenCarsIDs.includes(car.id))
      );

      // Disable dates for the chosen cars
      setDisabledDates(
        selectedMonthBookings.reduce((newDisabledDates: string[], booking) => {
          return newDisabledDates.concat(getDateRange(booking.checkIn, booking.checkOut));
        }, [])
      );
    }
  }, [allCarBookingsQuery.data, chosenCars]);

  return { disabledDates, setDisabledDates };
};
