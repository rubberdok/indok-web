import { Booking, BookingStatus, Cabin } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { ValidationError } from "@/core/errors";
import { ICabinRepository, Types as RepositoryTypes } from "@/repositories";
import { IMailService, TemplateAliasEnum } from "@/services/mail/interfaces";
import Types from "@/services/types";

import { BookingData, ICabinService } from "./interfaces";
import { bookingSchema } from "./validation";

@injectable()
export default class CabinService implements ICabinService {
  constructor(
    @inject(RepositoryTypes.CabinRepsitory)
    private cabinRepository: ICabinRepository,
    @inject(Types.MailService) private mailService: IMailService
  ) {}

  getCabin(id: string): Promise<Cabin> {
    return this.cabinRepository.getCabinById(id);
  }

  private validateBooking(data: BookingData): void {
    bookingSchema.parse(data);
  }

  private sendBookingConfirmation(booking: Booking) {
    return this.mailService.send({
      TemplateAlias: TemplateAliasEnum.CABIN_BOOKING_RECEIPT,
      TemplateModel: {
        firstName: booking.firstName,
        lastName: booking.lastName,
      },
    });
  }

  async newBooking(data: BookingData): Promise<Booking> {
    this.validateBooking(data);
    const booking = await this.cabinRepository.createBooking(data);
    this.sendBookingConfirmation(booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (status === BookingStatus.CONFIRMED) {
      const booking = await this.cabinRepository.getBookingById(id);
      const overlapping = await this.cabinRepository.getOverlappingBookings({
        bookingId: id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status,
      });
      if (overlapping.length > 0) {
        throw new ValidationError("bookings cannot overlap");
      }
    }
    return this.cabinRepository.updateBooking(id, { status });
  }
}
