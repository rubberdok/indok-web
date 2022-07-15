import { Repository } from "../repository";
import { AuthenticationService } from "./auth";
import { PermissionsService } from "./permissions";
import { UsersService } from "./users";

export type Service = ReturnType<typeof service>;

const service = (repository: Repository) => ({
  auth: AuthenticationService({
    usersRepository: repository.users,
    authRepository: repository.auth,
  }),
  users: UsersService({
    usersRepository: repository.users,
  }),
  permissions: PermissionsService({
    permissionsRepository: repository.permissions,
  }),
});

export default service;
