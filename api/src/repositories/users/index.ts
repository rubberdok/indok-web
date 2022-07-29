import { Prisma, User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { CoreTypes } from "../../core";
import { Database } from "../../core/interfaces";
import { IUserRepository } from "../interfaces";

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(@inject(CoreTypes.Prisma) private db: Database) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }

  getAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  get(id: string): Promise<User> {
    return this.db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  getByFeideId(feideId: string): Promise<User> {
    return this.db.user.findFirstOrThrow({
      where: {
        feideId,
      },
    });
  }
}
