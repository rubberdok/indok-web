import { Permission } from "@prisma/client";
import { PermissionsRepository } from "../../repository/permissions";

type Dependencies = {
  permissionsRepository: PermissionsRepository;
};

export const PermissionsService = ({
  permissionsRepository,
}: Dependencies) => ({
  getAllByUser: (userId: string): Promise<Permission[]> =>
    permissionsRepository.getAllByUser(userId),
});

export type PermissionsService = ReturnType<typeof PermissionsService>;
