import { Container } from "inversify";

import { IPermissionRepository, IUserRepository, ICabinRepository } from "@/repositories/interfaces";

import { default as UserRepository } from "@/repositories/users";
import { default as PermissionRepository } from "@/repositories/permissions";
import { default as CabinRepository } from "@/repositories/cabins";

import { default as Types } from "@/repositories/types";

export const bind = (container: Container) => {
  container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
  container.bind<IPermissionRepository>(Types.PermissionRepository).to(PermissionRepository);
  container.bind<ICabinRepository>(Types.CabinRepsitory).to(CabinRepository);
};

export { IUserRepository, IPermissionRepository, ICabinRepository };
export { Types };
