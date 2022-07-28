import "reflect-metadata";

import { Container, inject, injectable } from "inversify";

import { IPermissionService, IUserService, Types } from "../services";

export const Type = Symbol.for("ContextProvider");

export interface IContextProvider {
  userService: IUserService;
  permissionService: IPermissionService;
}

export interface IContext {
  userService: IUserService;
  permissionService: IPermissionService;
}

@injectable()
class ContextProvider implements IContextProvider {
  public constructor(
    @inject(Types.UserService) public userService: IUserService,
    @inject(Types.PermissionService)
    public permissionService: IPermissionService
  ) {}
}

export default {
  bind: (container: Container) => {
    container.bind<IContextProvider>(Type).to(ContextProvider);
  },
};
