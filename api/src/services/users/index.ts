import "reflect-metadata";

import { User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Types, IUserRepository } from "../../repositories";
import { IUserService } from "../interfaces";

@injectable()
export default class UsersService implements IUserService {
  private _usersRepository: IUserRepository;

  public async get(id: string): Promise<User> {
    return this._usersRepository.get(id);
  }
  public async getAll(): Promise<User[]> {
    return this._usersRepository.getAll();
  }
  public constructor(
    @inject(Types.UserRepository)
    usersRepository: IUserRepository
  ) {
    this._usersRepository = usersRepository;
  }
}
