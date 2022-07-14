import { Repository } from "../repository";
import { AuthenticationService } from "./auth";

export type Service = ReturnType<typeof service>;

const service = (repository: Repository) => ({
  auth: AuthenticationService({ usersRepository: repository.users }),
});

export default service;
