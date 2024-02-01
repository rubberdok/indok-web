import dayjs from "@/lib/date";

export function calculatePrice(
  chosenCars: {
    internalPrice: number;
    externalPrice: number;
    internalPriceWeekend: number;
    externalPriceWeekend: number;
  }[],
  contactInfo: { internalParticipants: number; externalParticipants: number } | undefined,
  startDate: dayjs.Dayjs | undefined,
  endDate: dayjs.Dayjs | undefined
): number | undefined {
  if (!contactInfo) return NaN;
  const internalPrice = contactInfo.internalParticipants >= contactInfo.externalParticipants;
  let currentDate = dayjs(startDate);
  const finalDate = dayjs(endDate);
  let weekdayNights = 0;
  let weekendNights = 0;
  let totalPrice = 0;
  while (currentDate.isBefore(finalDate, "day")) {
    // Last day has no night.
    if (currentDate.day() === 5 || currentDate.day() === 6) {
      // 5 = Friday to sat, 6 = Saturday to sunday
      weekendNights++;
    } else {
      weekdayNights++;
    }
    currentDate = currentDate.add(1, "day");
  }

  chosenCars.forEach((car) => {
    if (internalPrice) {
      totalPrice += weekdayNights * car.internalPrice + weekendNights * car.internalPriceWeekend;
    } else {
      totalPrice += weekdayNights * car.externalPrice + weekendNights * car.externalPriceWeekend;
    }
  }); // Add closing parenthesis here

  return totalPrice;
}
