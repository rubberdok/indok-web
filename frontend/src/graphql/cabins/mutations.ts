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

export const CONFIRM_BOOKING = gql`
  mutation ConfirmBooking($id: ID!) {
    updateBooking(bookingData: { id: $id, isTentative: false }) {
      ok
    }
  }
`;
