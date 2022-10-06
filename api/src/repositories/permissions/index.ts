import { Permission, User } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { CoreTypes } from "@/core";
import { Database } from "@/core/interfaces";
import { IPermissionRepository } from "@/repositories/interfaces";
import { PermissionString } from "@/services/permissions/types";

@injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(@inject(CoreTypes.Prisma) public db: Database) {}

  async hasPermission(user: User, permission: PermissionString | string): Promise<boolean> {
    const perm = await this.db.permission.findFirst({
      where: {
        OR: [
          { userId: user.id },
          {
            role: {
              userId: user.id,
            },
          },
        ],
        name: permission,
      },
    });
    return perm !== null;
  }

  getManyByUser(id: string): Promise<Permission[]> {
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
