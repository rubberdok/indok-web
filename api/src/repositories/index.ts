import { Container } from "inversify";

import { default as CabinRepository } from "@/repositories/cabins";
import { IPermissionRepository, IUserRepository, ICabinRepository } from "@/repositories/interfaces";
import { default as PermissionRepository } from "@/repositories/permissions";
import { default as Types } from "@/repositories/types";
import { default as UserRepository } from "@/repositories/users";

export const bind = (container: Container) => {
  container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
  container.bind<IPermissionRepository>(Types.PermissionRepository).to(PermissionRepository);
  container.bind<ICabinRepository>(Types.CabinRepsitory).to(CabinRepository);
};

export { IUserRepository, IPermissionRepository, ICabinRepository };
export { Types };
