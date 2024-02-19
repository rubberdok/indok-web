import { AdminCarBookingFragment, SendEmailMutationVariables } from "@/generated/graphql";

export function getDecisionEmailInput(
  booking: AdminCarBookingFragment,
  approved: boolean,
  declineMessage?: string
): SendEmailMutationVariables {
  // omit unwanted fields
  const { checkIn, checkOut, externalParticipants, firstName, internalParticipants, lastName, phone, receiverEmail } =
    booking;

  const emailInput = {
    ...{
      checkIn,
      checkOut,
      externalParticipants,
      firstName,
      internalParticipants,
      lastName,
      phone,
      receiverEmail,
    },
    cars: booking.cars.map((car) => parseInt(car.id)),
    emailType: approved ? "approve_booking" : "disapprove_booking",
    extraInfo: declineMessage,
  };

  return { emailInput };
}
