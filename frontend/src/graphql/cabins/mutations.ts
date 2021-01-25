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
      bookFrom: $bookFrom
      bookTo: $bookTo
      price: $price
      cabins: $cabins
    ) {
      ok
    }
  }
`;

export const SEND_EMAIL = gql`
  mutation SendEmail(
    $firstname: String
    $surname: String
    $receiverEmail: String
    $bookFrom: String
    $bookTo: String
    $price: Int
  ) {
    sendEmail(
      firstname: $firstname
      surname: $surname
      receiverEmail: $receiverEmail
      bookFrom: $bookFrom
      bookTo: $bookTo
      price: $price
    ) {
      ok
    }
  }
`;
