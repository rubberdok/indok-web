import { Organization } from "./organizations";

export type Membership = {
  id: number;
  group: {
    uuid: string;
  };
  organization: Organization;
};
