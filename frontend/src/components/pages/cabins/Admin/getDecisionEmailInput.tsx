import { AdminBookingFragment, SendEmailMutationVariables } from "@/generated/graphql";

export function getDecisionEmailInput(
  booking: AdminBookingFragment,
  approved: boolean,
  declineMessage?: string
): SendEmailMutationVariables {
  // omit unwanted fields
  const {
    checkIn,
    checkOut,
    externalParticipants,
    externalStudentParticipants,
    firstName,
    internalParticipants,
    lastName,
    phone,
    receiverEmail,
  } = booking;

  const emailInput = {
    ...{
      checkIn,
      checkOut,
      externalParticipants,
      externalStudentParticipants,
      firstName,
      internalParticipants,
      lastName,
      phone,
      receiverEmail,
    },
    cabins: booking.cabins.map((cabin) => parseInt(cabin.id)),
    emailType: approved ? "approve_booking" : "disapprove_booking",
    extraInfo: declineMessage,
  };

  return { emailInput };
}
