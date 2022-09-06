import { BookingData } from "@/services/cabins/interfaces";
import { CabinBookingReceipt } from "@/services/mail/interfaces";

export interface NegativeValidationTestCase {
  name: string;
  input: BookingData;
  expectedError: string;
}

export interface PositiveValidationTestCase {
  name: string;
  input: BookingData;
  expectedConfirmationEmail: CabinBookingReceipt;
}
