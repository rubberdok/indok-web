import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $firstname: String
    $surname: String
    $phone: Int
    $receiverEmail: String
    $bookFrom: String
    $bookTo: String
    $price: Int
    $cabins: [Int]
  ) {
    createBooking(
      firstname: $firstname
      surname: $surname
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
