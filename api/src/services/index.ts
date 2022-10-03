import { DependencyContainer } from "tsyringe";

import { default as FeideService } from "@/services/auth";
import { default as CabinService } from "@/services/cabins";
import { ICabinService, IMailService, IPermissionService, IUserService, IAuthService } from "@/services/interfaces";
import { default as MailService } from "@/services/mail";
import { default as PermissionService } from "@/services/permissions";
import { default as Types } from "@/services/types";
import { default as UserService } from "@/services/users";

export const register = (container: DependencyContainer) => {
  container.register<IUserService>(Types.UserService, { useClass: UserService });
  container.register<IPermissionService>(Types.PermissionService, { useClass: PermissionService });
  container.register<ICabinService>(Types.CabinService, { useClass: CabinService });
  container.register<IMailService>(Types.MailService, { useClass: MailService });
  container.register<IAuthService>(Types.AuthService, { useClass: FeideService });
};

export { IUserService, IPermissionService, ICabinService, IMailService, IAuthService };
export { Types };
