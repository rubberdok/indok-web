import { Prisma, User } from "@prisma/client";
import { IUserService } from "../../../interfaces";

export default class MockUserSerivce implements IUserService {
  login(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getByFeideID(feideId: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  create(data: Prisma.UserCreateInput): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
