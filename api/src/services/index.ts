import { Container } from "inversify";

import { ICabinService, IMailService, IPermissionService, IUserService, IAuthService } from "./interfaces";

import { default as CabinService } from "./cabins";
import { default as MailService } from "./mail";
import { default as PermissionService } from "./permissions";
import { default as UserService } from "./users";
import { default as FeideService } from "./auth";

import { default as Types } from "./types";

export const bind = (container: Container) => {
  container.bind<IUserService>(Types.UserService).to(UserService);
  container.bind<IPermissionService>(Types.PermissionService).to(PermissionService);
  container.bind<ICabinService>(Types.CabinService).to(CabinService);
  container.bind<IMailService>(Types.MailService).to(MailService);
  container.bind<IAuthService>(Types.AuthService).to(FeideService);
};

export { IUserService, IPermissionService, ICabinService, IMailService, IAuthService };
export { Types };
