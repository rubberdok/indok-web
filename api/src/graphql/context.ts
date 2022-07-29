import { Container, inject, injectable } from "inversify";

import {
  ICabinService,
  IPermissionService,
  IUserService,
  Types,
} from "../services";

export const Type = Symbol.for("ContextProvider");

export interface IContextProvider {
  userService: IUserService;
  permissionService: IPermissionService;
  cabinService: ICabinService;
}

export interface IContext {
  userService: IUserService;
  permissionService: IPermissionService;
  cabinService: ICabinService;
}

@injectable()
class ContextProvider implements IContextProvider {
  public constructor(
    @inject(Types.UserService) public userService: IUserService,
    @inject(Types.PermissionService)
    public permissionService: IPermissionService,
    @inject(Types.CabinService) public cabinService: ICabinService
  ) {}
}

export default {
  bind: (container: Container) => {
    container.bind<IContextProvider>(Type).to(ContextProvider);
  },
};
