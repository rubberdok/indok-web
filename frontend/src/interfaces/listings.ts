import { Form } from "@interfaces/forms";
import { Organization } from "@interfaces/organizations";

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDatetime: string;
  deadline: string;
  endDatetime: string;
  organization?: Organization;
  url?: string;
  form?: Form;
  hero?: string;
  logo?: string;
}
