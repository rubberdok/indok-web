import { Permission, User } from "@prisma/client";

import { PermissionString } from "@/services/permissions/types";

export interface IPermissionRepository {
  getManyByUser(id: string): Promise<Permission[]>;
  hasPermission(user: User, permission: PermissionString | string): Promise<boolean>;
}
