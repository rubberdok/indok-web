import { Container } from "inversify";

import {
  IPermissionRepository,
  IUserRepository,
  ICabinRepository,
} from "./interfaces";

import { default as UserRepository } from "./users";
import { default as PermissionRepository } from "./permissions";
import { default as CabinRepository } from "./cabins";

import { default as Types } from "./types";

export const bind = (container: Container) => {
  container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
  container
    .bind<IPermissionRepository>(Types.PermissionRepository)
    .to(PermissionRepository);
  container.bind<ICabinRepository>(Types.CabinRepsitory).to(CabinRepository);
};

export { IUserRepository, IPermissionRepository, ICabinRepository };
export { Types };
