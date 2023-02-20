import { DependencyContainer } from "tsyringe";

import { CabinRepository } from "./cabins";
import { ICabinRepository, IUserRepository } from "./interfaces";
import { Types } from "./types";
import { UserRepository } from "./users";

export const register = (container: DependencyContainer) => {
  container.register<IUserRepository>(Types.UserRepository, { useClass: UserRepository });
  container.register<ICabinRepository>(Types.CabinRepsitory, { useClass: CabinRepository });
};

export { IUserRepository, ICabinRepository };
export { Types };
