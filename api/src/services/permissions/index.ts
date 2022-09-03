import { inject, injectable } from "inversify";

import { IPermissionRepository, Types } from "@/repositories";
import { IPermissionService } from "@/services/interfaces";
import { Permission, User } from "@prisma/client";

import { PermissionDeniedError } from "./errors";
import { PermissionString } from "./types";
import { isPermissionString } from "./utils";

@injectable()
export default class PermissionService implements IPermissionService {
  constructor(
    @inject(Types.PermissionRepository)
    private permissionRepository: IPermissionRepository
  ) {}
  hasPermission(user: User, permission: PermissionString | string): Promise<boolean> {
    if (user.isSuperUser) return Promise.resolve(true);
    return this.permissionRepository.hasPermission(user, permission);
  }

  getAllByUser(id: string): Promise<Permission[]> {
    return this.permissionRepository.getManyByUser(id);
  }

  async permissionRequired(user: User, permission: PermissionString): Promise<void> {
    if (isPermissionString(permission)) {
      if (await this.hasPermission(user, permission)) return;
      throw new PermissionDeniedError(permission);
    }
  }
}
