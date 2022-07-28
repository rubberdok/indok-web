import { Container } from "inversify";
import "reflect-metadata";

import { IPermissionRepository, IUserRepository } from "./interfaces";

import { default as UserRepository } from "./users";
import { default as PermissionRepository } from "./permissions";

import { default as Types } from "./types";

export const bind = (container: Container) => {
  container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
  container
    .bind<IPermissionRepository>(Types.PermissionRepository)
    .to(PermissionRepository);
};

export { IUserRepository, IPermissionRepository };
export { Types };
