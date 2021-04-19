import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking($bookingData: BookingInput) {
    createBooking(bookingData: $bookingData) {
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
