import dayjs from "@/lib/date";

export function calculatePrice(
  chosenCabins: {
    internalPrice: number;
    externalPrice: number;
    externalStudentPrice: number;
    internalPriceWeekend: number;
    externalPriceWeekend: number;
    externalStudentPriceWeekend: number;
  }[],
  contactInfo:
    | { internalParticipants: number; externalParticipants: number; externalStudentParticipants: number }
    | undefined,
  startDate: dayjs.Dayjs | undefined,
  endDate: dayjs.Dayjs | undefined
): number | undefined {
  if (!contactInfo) return NaN;
  const internalPrice =
    contactInfo.internalParticipants >= contactInfo.externalParticipants + contactInfo.externalStudentParticipants;
  const externalPrice =
    contactInfo.externalParticipants >= contactInfo.externalStudentParticipants + contactInfo.internalParticipants;

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

  chosenCabins.forEach((cabin) => {
    if (internalPrice) {
      totalPrice += weekdayNights * cabin.internalPrice + weekendNights * cabin.internalPriceWeekend;
    } else if (externalPrice) {
      totalPrice += weekdayNights * cabin.externalPrice + weekendNights * cabin.externalPriceWeekend;
    } else {
      totalPrice += weekdayNights * cabin.externalStudentPrice + weekendNights * cabin.externalStudentPriceWeekend;
    }
  }); // Add closing parenthesis here

  return totalPrice;
}
