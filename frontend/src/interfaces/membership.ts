import { Organization } from "./organizations";

export type Membership = {
  id: number;
  group: string;
  organization: Organization;
};
