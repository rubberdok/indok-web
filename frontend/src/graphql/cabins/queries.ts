import { gql } from "@apollo/client";

export const QUERY_ALL_BOOKINGS = gql`
  query {
    allBookings {
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

export const QUERY_BOOKING_RANGE = gql`
  query BookingRange($year: String, $month: String) {
    bookingsByMonth(year: $year, month: $month) {
      id
      contactNum
      contactPerson
      startDay
      endDay
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
