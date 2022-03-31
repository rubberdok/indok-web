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
      isDeclined
      timestamp
      extraInfo
      declineReason
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

export const QUERY_BOOKING_RESPONSIBLE = gql`
  query ActiveBookingResponsible {
    activeBookingResponsible {
      id
      active
      firstName
      lastName
      email
    }
  }
`;

export const QUERY_BOOKING_SEMESTERS = gql`
  query BookingSemesters {
    bookingSemester {
      fallStartDate
      fallEndDate
      springStartDate
      springEndDate
      fallSemesterActive
      springSemesterActive
    }
  }
`;
