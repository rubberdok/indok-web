import { Permission, Prisma, Role, User } from "@prisma/client";
import { PermissionString } from "./permissions/types";

export { ICabinService } from "./cabins/interfaces";
export { IMailService } from "./mail/interfaces";

export interface IUserService {
  login(id: string): Promise<User>;
  get(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  getByFeideID(feideId: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}

export interface IPermissionService {
  getAllByUser(id: string): Promise<Permission[]>;
  permissionRequired(permissionHolder: User | Role, permission: PermissionString): Promise<void>;
}

export interface GetUserParams {
  code: string;
  encryptedCodeVerifier: string;
}

export interface IAuthService {
  getUser(data: GetUserParams): Promise<User>;
  ssoUrl(state?: string | null): {
    url: string;
    encryptedCodeVerifier: string;
    codeChallenge: string;
    codeVerifier: string;
  };
}
