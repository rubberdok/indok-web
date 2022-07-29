import { Permission } from "@prisma/client";

export interface IPermissionRepository {
  getByUser(id: string): Promise<Permission[]>;
}
