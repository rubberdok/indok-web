import { Prisma, User } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { CoreTypes } from "@/core";
import { Database } from "@/core/interfaces";
import { IUserRepository } from "@/repositories/users/interfaces";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(CoreTypes.Prisma) private db: Database) {}

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({
      where: {
        id,
      },
      data,
    });
  }

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
