import "reflect-metadata";

import { User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Types, IUserRepository } from "../../repositories";
import { IUserService } from "../interfaces";

@injectable()
export default class UsersService implements IUserService {
  public constructor(
    @inject(Types.UserRepository)
    private usersRepository: IUserRepository
  ) {}

  public async get(id: string): Promise<User> {
    return this.usersRepository.get(id);
  }
  public async getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }
}
