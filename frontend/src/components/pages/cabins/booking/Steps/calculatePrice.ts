import dayjs from "dayjs";

export function calculatePrice(
  chosenCabins: { internalPrice: number; externalPrice: number }[],
  contactInfo: { internalParticipants: number; externalParticipants: number } | undefined,
  startDate: dayjs.Dayjs | undefined,
  endDate: dayjs.Dayjs | undefined
): number | undefined {
  if (!contactInfo) return NaN;
  const internalPrice = contactInfo.internalParticipants >= contactInfo.externalParticipants;
  const pricePerNight = chosenCabins
    .map((cabin) => (internalPrice ? cabin.internalPrice : cabin.externalPrice))
    .reduce((sum, currentPrice) => sum + currentPrice);

  if (startDate && endDate) {
    const duration = endDate.diff(startDate, "day");
    return pricePerNight * duration;
  }
  return NaN;
}
