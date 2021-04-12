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
  mutation SendEmail(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $numberIndok: Int
    $numberExternal: Int
    $cabinIds: [String]
    $checkInDate: String
    $checkOutDate: String
    $emailType: String
  ) {
    sendEmail(
      emailInput: {
        firstname: $firstName
        lastname: $lastName
        email: $email
        phone: $phone
        numberIndok: $numberIndok
        numberExternal: $numberExternal
        cabinIds: $cabinIds
        checkInDate: $checkInDate
        checkOutDate: $checkOutDate
      }
      emailType: $emailType
    ) {
      ok
    }
  }
`;
