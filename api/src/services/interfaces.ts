import { Permission, User } from "@prisma/client";

export interface IUserService {
  get(id: string): Promise<User>;
  getAll(): Promise<User[]>;
}

export interface IPermissionService {
  getAllByUser(id: string): Promise<Permission[]>;
}
