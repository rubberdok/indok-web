import "reflect-metadata";

import { Permission, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IPermissionRepository } from "../interfaces";
import { Types as CoreTypes } from "../../core";

@injectable()
export default class PermissionRepository implements IPermissionRepository {
  public constructor(@inject(CoreTypes.Prisma) public db: PrismaClient) {}
  public getByUser(id: string): Promise<Permission[]> {
    return this.db.permission.findMany({
      where: {
        OR: [
          { userId: id },
          {
            role: {
              userId: id,
            },
          },
        ],
      },
    });
  }
}
