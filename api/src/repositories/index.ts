import { DependencyContainer } from "tsyringe";

import { default as CabinRepository } from "@/repositories/cabins";
import { IPermissionRepository, IUserRepository, ICabinRepository } from "@/repositories/interfaces";
import { default as PermissionRepository } from "@/repositories/permissions";
import { default as Types } from "@/repositories/types";
import { default as UserRepository } from "@/repositories/users";

export const register = (container: DependencyContainer) => {
  container.register<IUserRepository>(Types.UserRepository, { useClass: UserRepository });
  container.register<IPermissionRepository>(Types.PermissionRepository, { useClass: PermissionRepository });
  container.register<ICabinRepository>(Types.CabinRepsitory, { useClass: CabinRepository });
};

export { IUserRepository, IPermissionRepository, ICabinRepository };
export { Types };
