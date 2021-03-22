import { gql } from "@apollo/client";

export const CREATE_CABIN = gql`
  mutation CreateCabin(
    $firstname: String
    $surname: String
    $phone: Int
    $receiverEmail: String
    $bookFrom: String
    $bookTo: String
    $price: Int
    $cabins: [Int]
  ) {
    createCabin(
      firstname: $firstname
      surname: $surname
      phone: $phone
      receiver_email: $receiverEmail
      check_in: $bookFrom
      check_out: $bookTo
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
