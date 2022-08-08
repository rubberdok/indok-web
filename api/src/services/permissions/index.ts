import { inject, injectable } from "inversify";

import { Permission, Role, User } from "@prisma/client";
import { IPermissionRepository, Types } from "../../repositories";
import { IPermissionService } from "../interfaces";
import { PermissionString } from "./types";
import { PermissionDeniedError } from "./errors";

@injectable()
export default class PermissionService implements IPermissionService {
  constructor(
    @inject(Types.PermissionRepository)
    private permissionRepository: IPermissionRepository
  ) {}

  getAllByUser(id: string): Promise<Permission[]> {
    return this.permissionRepository.getByUser(id);
  }

  async permissionRequired(
    permissionHolder: User | Role,
    permission: PermissionString
  ): Promise<void> {
    const permissions = await this.permissionRepository.getByUser(
      permissionHolder.id
    );
    if (!permissions.some((perm) => perm.name === permission))
      throw new PermissionDeniedError();
  }
}
