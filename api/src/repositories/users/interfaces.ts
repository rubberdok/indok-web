import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
  getAll(): Promise<User[]>;
  get(id: string): Promise<User>;
  getByFeideId(feideId: string): Promise<User>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}
