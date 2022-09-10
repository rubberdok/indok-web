import { Container } from "inversify";

import { default as FeideService } from "@/services/auth";
import { default as CabinService } from "@/services/cabins";
import { ICabinService, IMailService, IPermissionService, IUserService, IAuthService } from "@/services/interfaces";
import { default as MailService } from "@/services/mail";
import { default as PermissionService } from "@/services/permissions";
import { default as Types } from "@/services/types";
import { default as UserService } from "@/services/users";

export const bind = (container: Container) => {
  container.bind<IUserService>(Types.UserService).to(UserService);
  container.bind<IPermissionService>(Types.PermissionService).to(PermissionService);
  container.bind<ICabinService>(Types.CabinService).to(CabinService);
  container.bind<IMailService>(Types.MailService).to(MailService);
  container.bind<IAuthService>(Types.AuthService).to(FeideService);
};

export { IUserService, IPermissionService, ICabinService, IMailService, IAuthService };
export { Types };
