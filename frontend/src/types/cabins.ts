import {
  AdminBookingFragment,
  BookingFragment,
  BookingResponsibleFragment,
  BookingSemesterFragment,
  CabinFragment,
} from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Cabin = GraphqlType<CabinFragment>;

export type Booking = GraphqlType<BookingFragment>;

export type AdminBooking = GraphqlType<AdminBookingFragment>;

export type BookingResponsible = GraphqlType<BookingResponsibleFragment>;

export type BookingSemester = GraphqlType<BookingSemesterFragment>;
