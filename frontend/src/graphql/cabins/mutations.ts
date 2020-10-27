import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
    mutation CreateBooking($contactNum: Int, $contactPerson: String, $endDay: String, $startDay: String, $price: Int) {
        createBooking(
            contactNum: $contactNum
            contactPerson: $contactPerson
            endDay: $endDay
            startDay: $startDay
            price: $price
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
    ) {
        sendEmail(
            firstname: $firstname
            surname: $surname
            receiverEmail: $receiverEmail
            bookFrom: $bookFrom
            bookTo: $bookTo
        ) {
            ok
        }
    }
`;
