import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation MutateBooking(
    $firstname: String
    $lastname: String
    $phone: Int
    $receiverEmail: String
    $bookFrom: String
    $bookTo: String
    $price: Int
    $cabins: [Int]
  ) {
    mutateBooking(
      firstname: $firstname
      lastname: $lastname
      phone: $phone
      receiverEmail: $receiverEmail
      checkIn: $bookFrom
      checkOut: $bookTo
      price: $price
      cabins: $cabins
    ) {
      ok
    }
  }
`;

export const SEND_EMAIL = gql`
  mutation SendEmail($emailInput: EmailInput) {
    sendEmail(emailInput: $emailInput) {
      ok
    }
  }
`;

export const CONFIRM_BOOKING = gql`
  mutation ConfirmBooking($id: ID) {
    mutateBooking(bookingData: { id: $id, isTentative: false }) {
      ok
    }
  }
`;
