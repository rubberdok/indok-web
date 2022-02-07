import { Organization } from "@interfaces/organizations";

export type BaseOrg = Pick<Organization, "id" | "name" | "logoUrl">;
