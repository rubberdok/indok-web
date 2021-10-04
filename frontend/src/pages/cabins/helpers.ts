import { useMutation } from "@apollo/client";
import { SEND_EMAIL } from "@graphql/cabins/mutations";
import { BookingFromQuery } from "@interfaces/cabins";

const [send_email] = useMutation(SEND_EMAIL);

export const sendDecisionEmail = (booking: BookingFromQuery, approved: boolean) => {
  // omit unwanted fields
  const { checkIn, checkOut, externalParticipants, firstName, internalParticipants, lastName, phone, receiverEmail } =
    booking;

  send_email({
    variables: {
      emailInput: {
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
        cabins: booking.cabins.map((cabin) => parseInt(cabin.id)),
        emailType: approved ? "approve_booking" : "disapprove_booking",
      },
    },
  });
};
