import "reflect-metadata";

import { randomUUID } from "crypto";

import { faker } from "@faker-js/faker";
import { BookingStatus, Cabin } from "@prisma/client";
import dayjs from "dayjs";
import { container as _container } from "tsyringe";

import { CoreTypes, Database } from "@/core";
import prisma from "@/lib/prisma";
import { Types } from "@/repositories";
import { CabinRepository } from "@/repositories/cabins";
import { ICabinRepository } from "@/repositories/cabins/interfaces";

const systemTime = dayjs().add(50, "years").toDate();

const cabins: Record<string, Cabin> = {};
const id = randomUUID();
const container = _container.createChildContainer();

beforeAll(() => {
  container.register<Database>(CoreTypes.Prisma, { useValue: prisma });
  container.register<ICabinRepository>(Types.CabinRepsitory, { useClass: CabinRepository });
  jest.useFakeTimers().setSystemTime(systemTime);
});

describe("Overlapping bookings", () => {
  beforeEach(async () => {
    const db = container.resolve<Database>(CoreTypes.Prisma);
    await db.booking.deleteMany({
      where: {
        OR: [
          {
            startDate: {
              gte: dayjs().toDate(),
            },
          },
          {
            endDate: {
              gte: dayjs().toDate(),
            },
          },
        ],
      },
    });

    const cabin = await db.cabin.upsert({
      where: {
        name: "Oksen",
      },
      update: {
        capacity: 18,
        internalPrice: 10,
        externalPrice: 20,
      },
      create: {
        name: "Oksen",
        capacity: 18,
        internalPrice: 10,
        externalPrice: 20,
      },
    });
    cabins["Oksen"] = cabin;

    await db.booking.createMany({
      data: [
        {
          cabinId: cabin.id,
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          startDate: dayjs().add(1, "day").toDate(),
          endDate: dayjs().add(2, "day").toDate(),
          status: BookingStatus.CONFIRMED,
        },
        {
          cabinId: cabin.id,
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          startDate: dayjs().add(2, "day").toDate(),
          endDate: dayjs().add(3, "day").toDate(),
          status: BookingStatus.CONFIRMED,
        },
        {
          id,
          cabinId: cabin.id,
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          startDate: dayjs().add(1, "day").toDate(),
          endDate: dayjs().add(3, "day").toDate(),
        },
      ],
    });
  });

  it("should find overlapping bookings", async () => {
    const cabinRepo = container.resolve<ICabinRepository>(Types.CabinRepsitory);
    const bookings = await cabinRepo.getOverlappingBookings({
      bookingId: id,
      startDate: dayjs().add(1, "day").toDate(),
      endDate: dayjs().add(3, "day").toDate(),
      status: BookingStatus.CONFIRMED,
    });

    expect(bookings).toHaveLength(2);
    expect(bookings[0].id).not.toBe(id);
    expect(bookings[1].id).not.toBe(id);
  });
});
