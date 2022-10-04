import { DependencyContainer } from "tsyringe";

import { FeideService } from "./auth";
import { CabinService } from "./cabins";
import { ICabinService, IMailService, IPermissionService, IUserService, IAuthService } from "./interfaces";
import { MailService } from "./mail";
import { PermissionService } from "./permissions";
import { Types } from "./types";
import { UserService } from "./users";

export const register = (container: DependencyContainer) => {
  container.register<IUserService>(Types.UserService, { useClass: UserService });
  container.register<IPermissionService>(Types.PermissionService, { useClass: PermissionService });
  container.register<ICabinService>(Types.CabinService, { useClass: CabinService });
  container.register<IMailService>(Types.MailService, { useClass: MailService });
  container.register<IAuthService>(Types.AuthService, { useClass: FeideService });
};

export { IUserService, IPermissionService, ICabinService, IMailService, IAuthService };
export { Types };
