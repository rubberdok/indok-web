import { Permission, Prisma, PrismaClient, User } from "@prisma/client";

export interface IUserRepository {
  getAll(): Promise<User[]>;
  get(id: string): Promise<User>;
  getByFeideId(feideId: string): Promise<User>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}

export interface IPermissionRepository {
  getByUser(id: string): Promise<Permission[]>;
}

export interface Database extends PrismaClient {}
