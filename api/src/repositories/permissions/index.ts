import { Permission } from "@prisma/client";
import { inject, injectable } from "inversify";
import { CoreTypes } from "../../core";
import { Database } from "../../core/interfaces";
import { IPermissionRepository } from "../interfaces";

@injectable()
export default class PermissionRepository implements IPermissionRepository {
  constructor(@inject(CoreTypes.Prisma) public db: Database) {}

  getByUser(id: string): Promise<Permission[]> {
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
