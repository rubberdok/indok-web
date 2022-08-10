import { Booking, BookingStatus, Cabin, Prisma, User } from "@prisma/client";

export interface BookingData
  extends Pick<
    Prisma.BookingCreateInput,
    "email" | "firstName" | "lastName" | "startDate" | "endDate" | "phoneNumber" | "cabinId"
  > {}

export interface ICabinService {
  newBooking(data: BookingData): Promise<Booking>;
  updateBookingStatus(user: User, id: string, status: BookingStatus): Promise<Booking>;
  getCabin(id: string): Promise<Cabin>;
}
