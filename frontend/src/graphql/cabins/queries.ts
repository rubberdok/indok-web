import { gql } from "@apollo/client";

export const QUERY_ALL_BOOKINGS = gql`
  query AllBookings($after: String) {
    allBookings(after: $after) {
      id
      firstname
      surname
      phone
      receiverEmail
      checkIn
      checkOut
      price
      cabins {
        id
        name
      }
      timestamp
    }
  }
`;

export const QUERY_CABINS = gql`
  query AllCabins {
    cabins {
      id
      name
      maxGuests
      internalPrice
      externalPrice
    }
  }
`;
