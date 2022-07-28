import "reflect-metadata";

import { Prisma, PrismaClient, User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IUserRepository } from "../interfaces";
import { Types as CoreTypes } from "../../core";

@injectable()
export default class UserRepository implements IUserRepository {
  private _db: PrismaClient;
  public constructor(@inject(CoreTypes.Prisma) db: PrismaClient) {
    this._db = db;
  }
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return this._db.user.create({
      data,
    });
  }

  public async getAll(): Promise<User[]> {
    return this._db.user.findMany();
  }

  public async get(id: string): Promise<User> {
    return this._db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }
  public async getByFeideId(feideId: string): Promise<User> {
    return this._db.user.findFirstOrThrow({
      where: {
        feideId,
      },
    });
  }
}
