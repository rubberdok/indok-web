import { Booking, BookingStatus, Cabin, Prisma } from "@prisma/client";

export type OverlappingBookingsData = {
  bookingId: string;
  startDate: Date;
  endDate: Date;
  status?: BookingStatus;
};

export interface ICabinRepository {
  createBooking(data: Prisma.BookingCreateInput): Promise<Booking>;
  updateBooking(id: string, data: Prisma.BookingUpdateInput): Promise<Booking>;
  getCabinById(id: string): Promise<Cabin>;
  getOverlappingBookings(data: OverlappingBookingsData): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking>;
}
