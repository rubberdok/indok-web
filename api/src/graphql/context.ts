import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { DependencyContainer, inject, injectable } from "tsyringe";

import { IAuthService, ICabinService, IPermissionService, IUserService, Types } from "@/services";

export const Type = Symbol.for("ContextProvider");

export interface IContextProvider {
  userService: IUserService;
  permissionService: IPermissionService;
  cabinService: ICabinService;
  authService: IAuthService;
}

export interface IContext extends ExpressContextFunctionArgument {
  userService: IUserService;
  permissionService: IPermissionService;
  cabinService: ICabinService;
  authService: IAuthService;
}

@injectable()
class ContextProvider implements IContextProvider {
  public constructor(
    @inject(Types.UserService) public userService: IUserService,
    @inject(Types.PermissionService)
    public permissionService: IPermissionService,
    @inject(Types.CabinService) public cabinService: ICabinService,
    @inject(Types.AuthService) public authService: IAuthService
  ) {}
}

export default {
  register: (container: DependencyContainer) => {
    container.register<IContextProvider>(Type, { useClass: ContextProvider });
  },
};
