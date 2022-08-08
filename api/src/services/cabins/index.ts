import { Booking, BookingStatus, Cabin, User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ICabinRepository, Types as RepositoryTypes } from "../../repositories";
import { IPermissionService } from "../interfaces";
import { IMailService, TemplateAliasEnum } from "../mail/interfaces";
import Types from "../types";
import { OverlappingBookingError } from "./errors";
import { BookingData, ICabinService } from "./interfaces";
import { bookingSchema } from "./validation";

@injectable()
export default class CabinService implements ICabinService {
  constructor(
    @inject(RepositoryTypes.CabinRepsitory)
    private cabinRepository: ICabinRepository,
    @inject(Types.MailService) private mailService: IMailService,
    @inject(Types.PermissionService)
    private permissionService: IPermissionService
  ) {}

  getCabin(id: string): Promise<Cabin> {
    return this.cabinRepository.getCabinById(id);
  }

  private validateBooking(data: BookingData): void {
    bookingSchema.parse(data);
  }

  private sendBookingValidation(booking: Booking) {
    return this.mailService.send({
      TemplateAlias: TemplateAliasEnum.CABIN_BOOKING_RECEIPT,
      TemplateModel: {
        title: "Booking Receipt",
      },
    });
  }

  async newBooking(data: BookingData): Promise<Booking> {
    this.validateBooking(data);
    const booking = await this.cabinRepository.createBooking(data);
    this.sendBookingValidation(booking);
    return booking;
  }

  async updateBookingStatus(
    user: User,
    id: string,
    status: BookingStatus
  ): Promise<Booking> {
    this.permissionService.permissionRequired(user, "write:booking");

    if (status === BookingStatus.CONFIRMED) {
      const booking = await this.cabinRepository.getBookingById(id);
      const overlapping = await this.cabinRepository.getOverlappingBookings({
        bookingId: id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status,
      });
      if (overlapping.length > 0) {
        throw new OverlappingBookingError();
      }
    }
    return this.cabinRepository.updateBooking(id, { status });
  }
}

export { OverlappingBookingError };
