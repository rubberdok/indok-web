import { Repository } from "../repository";
import { PermissionsService } from "./permissions";
import { UsersService } from "./users";

export type Service = ReturnType<typeof service>;

const service = (repository: Repository) => ({
  users: UsersService({
    usersRepository: repository.users,
  }),
  permissions: PermissionsService({
    permissionsRepository: repository.permissions,
  }),
});

export default service;
