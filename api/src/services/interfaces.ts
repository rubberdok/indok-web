import { Permission, User } from "@prisma/client";

export { ICabinService } from "./cabins/interfaces";
export { IMailService } from "./mail/interfaces";

export interface IUserService {
  get(id: string): Promise<User>;
  getAll(): Promise<User[]>;
}

export interface IPermissionService {
  getAllByUser(id: string): Promise<Permission[]>;
}
