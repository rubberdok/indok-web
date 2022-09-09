import "reflect-metadata";

import { randomUUID } from "crypto";

import { BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { Container } from "inversify";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { NegativeValidationTestCase, PositiveValidationTestCase } from "./interfaces";

import { ICabinRepository, Types as RepositoryTypes } from "@/repositories";
import { ICabinService, IMailService, Types as ServiceTypes } from "@/services";
import CabinService from "@/services/cabins";
import { BookingData } from "@/services/cabins/interfaces";
import { TemplateAliasEnum } from "@/services/mail/interfaces";

const container = new Container();

const validBooking: BookingData = {
  cabinId: randomUUID(),
  startDate: dayjs().add(1, "day").toDate(),
  endDate: dayjs().add(2, "day").toDate(),
  phoneNumber: "40000000",
  email: "exapmle@example.com",
  firstName: "test",
  lastName: "test",
};

beforeAll(() => {
  const mockCabinRepo = mockDeep<ICabinRepository>();
  const mockMailService = mockDeep<IMailService>();

  container.unbindAll();
  container.bind<DeepMockProxy<ICabinRepository>>(RepositoryTypes.CabinRepsitory).toConstantValue(mockCabinRepo);
  container.bind<DeepMockProxy<IMailService>>(ServiceTypes.MailService).toConstantValue(mockMailService);
  container.bind<ICabinService>(ServiceTypes.CabinService).to(CabinService);
});

describe("New booking", () => {
  const negativeValidationTestCases: NegativeValidationTestCase[] = [
    {
      name: "should disallow bookings with a start date in the past",
      input: {
        ...validBooking,
        startDate: dayjs().subtract(1, "day").toDate(),
      },
      expectedError: "start date must be in the future",
    },
    {
      name: "should disallow bookings with an end date in the past",
      input: {
        ...validBooking,
        endDate: dayjs().subtract(1, "day").toDate(),
      },
      expectedError: "end date must be in the future",
    },
    {
      name: "should disallow bookings with an end date before the start date",
      input: {
        ...validBooking,
        startDate: dayjs().add(3, "day").toDate(),
        endDate: dayjs().add(2, "day").toDate(),
      },
      expectedError: "end date must be after start date",
    },
    {
      name: "should disallow invalid emails",
      input: {
        ...validBooking,
        email: "example.com",
      },
      expectedError: "invalid email",
    },
    {
      name: "should disallow invalid phone numbers",
      input: {
        ...validBooking,
        phoneNumber: "111",
      },
      expectedError: "invalid phone number",
    },
    {
      name: "should disallow cabin ids",
      input: {
        ...validBooking,
        cabinId: "123",
      },
      expectedError: "invalid cabin id",
    },
  ];

  test.each(negativeValidationTestCases)("$name", async ({ input, expectedError }) => {
    const cabinService = container.get<ICabinService>(ServiceTypes.CabinService);
    expect(cabinService.newBooking(input)).rejects.toThrow(expectedError);
  });

  const positiveValidationTestCases: PositiveValidationTestCase[] = [
    {
      name: "should send a booking confirmation email",
      input: validBooking,
      expectedConfirmationEmail: {
        firstName: validBooking.firstName,
        lastName: validBooking.lastName,
      },
    },
  ];

  test.each(positiveValidationTestCases)("$name", async ({ input, expectedConfirmationEmail }) => {
    const cabinService = container.get<ICabinService>(ServiceTypes.CabinService);
    const cabinRepo = container.get<DeepMockProxy<ICabinRepository>>(RepositoryTypes.CabinRepsitory);
    const mailService = container.get<DeepMockProxy<IMailService>>(ServiceTypes.MailService);
    cabinRepo.createBooking.mockReturnValueOnce(
      Promise.resolve({
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: BookingStatus.PENDING,
      })
    );

    await cabinService.newBooking(input);
    expect(cabinRepo.createBooking).toHaveBeenCalledWith(input);
    expect(mailService.send).toHaveBeenCalledWith({
      TemplateAlias: TemplateAliasEnum.CABIN_BOOKING_RECEIPT,
      TemplateModel: expectedConfirmationEmail,
    });
  });
});
