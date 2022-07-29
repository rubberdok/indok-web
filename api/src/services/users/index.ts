import { User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { Types, IUserRepository } from "../../repositories";
import { IUserService } from "../interfaces";
import { userSchema } from "./validation";

@injectable()
export default class UsersService implements IUserService {
  constructor(
    @inject(Types.UserRepository)
    private usersRepository: IUserRepository
  ) {}

  private validateUser(user: User): void {
    userSchema.parse(user);
  }

  get(id: string): Promise<User> {
    return this.usersRepository.get(id);
  }
  getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }
}
