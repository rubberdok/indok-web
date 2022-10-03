import { Prisma, User } from "@prisma/client";
import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";

import { IUserRepository, Types } from "@/repositories";
import { IUserService } from "@/services/interfaces";

import { createUserSchema, updateUserSchema } from "./validation";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(Types.UserRepository)
    private usersRepository: IUserRepository
  ) {}

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    updateUserSchema.parse(data);

    const user = await this.usersRepository.get(id);

    if (user.firstLogin) {
      data = { ...data, firstLogin: false };
    } else if (!this.canUpdateYear(user)) {
      data = { ...data, graduationYear: undefined };
    } else if (data.graduationYear && data.graduationYear !== user.graduationYear) {
      data = { ...data, graduationYearUpdatedAt: new Date() };
    }

    return this.usersRepository.update(id, data);
  }

  canUpdateYear(user: User): boolean {
    return (
      user.graduationYearUpdatedAt === null || dayjs(user.graduationYearUpdatedAt).add(1, "year").isBefore(dayjs())
    );
  }

  login(id: string): Promise<User> {
    return this.usersRepository.update(id, { lastLogin: new Date() });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    this.validateUser(data);
    return this.usersRepository.create(data);
  }

  async getByFeideID(feideId: string): Promise<User | null> {
    try {
      return await this.usersRepository.getByFeideId(feideId);
    } catch (err) {
      return null;
    }
  }

  private validateUser(user: Prisma.UserCreateInput): void {
    createUserSchema.parse(user);
  }

  get(id: string): Promise<User> {
    return this.usersRepository.get(id);
  }
  getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }
}
