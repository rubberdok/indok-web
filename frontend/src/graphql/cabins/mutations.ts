import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
    mutation CreateBooking($contactNum: Int, $contactPerson: String, $endDay: String, $startDay: String) {
        createBooking(contactNum: $contactNum, contactPerson: $contactPerson, endDay: $endDay, startDay: $startDay) {
            ok
        }
    }
`;
