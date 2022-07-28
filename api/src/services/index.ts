import { Container } from "inversify";

import { IUserService, IPermissionService } from "./interfaces";

import { default as UserService } from "./users";
import { default as PermissionService } from "./permissions";

import { default as Types } from "./types";

export const bind = (container: Container) => {
  container.bind<IUserService>(Types.UserService).to(UserService);
  container
    .bind<IPermissionService>(Types.PermissionService)
    .to(PermissionService);
};

export { IUserService, IPermissionService };
export { Types };
