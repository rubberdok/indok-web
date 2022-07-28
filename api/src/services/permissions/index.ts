import "reflect-metadata";

import { inject, injectable } from "inversify";

import { IPermissionService } from "../interfaces";
import { IPermissionRepository, Types } from "../../repositories";
import { Permission } from "@prisma/client";

@injectable()
export default class PermissionService implements IPermissionService {
  public constructor(
    @inject(Types.PermissionRepository)
    private permissionRepository: IPermissionRepository
  ) {}

  public getAllByUser(id: string): Promise<Permission[]> {
    return this.permissionRepository.getByUser(id);
  }
}
