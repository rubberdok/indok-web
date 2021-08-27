import { Form } from "@interfaces/forms";
import { Organization } from "@interfaces/organizations";

export type LISTING = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDatetime: string;
  deadline: string;
  endDatetime: string;
  url?: string;
  hero?: string;
  logo?: string;
  organization: Organization;
  form?: Pick<Form, "id">;
  chips: string[];
};
