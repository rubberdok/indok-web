import { gql } from "@apollo/client";

export const QUERY_ALL_BOOKINGS = gql`
  query AllBookings {
    allBookings {
      id
      checkIn
      checkOut
      cabins {
        id
        name
      }
    }
  }
`;
export const QUERY_ADMIN_ALL_BOOKINGS = gql`
  query AdminAllBookings($after: String) {
    adminAllBookings(after: $after) {
      id
      firstName
      lastName
      phone
      receiverEmail
      checkIn
      checkOut
      cabins {
        id
        name
      }
      externalParticipants
      internalParticipants
      price
      isTentative
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
