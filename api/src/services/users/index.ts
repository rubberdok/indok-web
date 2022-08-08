import { Prisma, User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IUserRepository, Types } from "../../repositories";
import { IUserService } from "../interfaces";
import { createUserSchema } from "./validation";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(Types.UserRepository)
    private usersRepository: IUserRepository
  ) {}
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
