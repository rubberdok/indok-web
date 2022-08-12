import { Permission, Prisma, Role, User } from "@prisma/client";
import { PermissionString } from "./permissions/types";

export { ICabinService } from "./cabins/interfaces";
export { IMailService } from "./mail/interfaces";

export interface IUserService {
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  login(id: string): Promise<User>;
  get(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  getByFeideID(feideId: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  canUpdateYear(user: User): boolean;
}

export interface IPermissionService {
  hasPermission(user: User, permission: PermissionString | string): Promise<boolean>;
  getAllByUser(id: string): Promise<Permission[]>;
  permissionRequired(permissionHolder: User | Role, permission: PermissionString): Promise<void>;
}

export interface GetUserParams {
  code: string;
  codeVerifier: string;
}

export interface IAuthService {
  getUser(data: GetUserParams): Promise<User>;
  ssoUrl(state?: string | null): {
    url: string;
    codeChallenge: string;
    codeVerifier: string;
  };
}
