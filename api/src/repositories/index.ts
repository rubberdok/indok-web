import { DependencyContainer } from "tsyringe";

import { CabinRepository } from "./cabins";
import { ICabinRepository, IPermissionRepository, IUserRepository } from "./interfaces";
import { PermissionRepository } from "./permissions";
import { Types } from "./types";
import { UserRepository } from "./users";

export const register = (container: DependencyContainer) => {
  container.register<IUserRepository>(Types.UserRepository, { useClass: UserRepository });
  container.register<IPermissionRepository>(Types.PermissionRepository, { useClass: PermissionRepository });
  container.register<ICabinRepository>(Types.CabinRepsitory, { useClass: CabinRepository });
};

export { IUserRepository, IPermissionRepository, ICabinRepository };
export { Types };
