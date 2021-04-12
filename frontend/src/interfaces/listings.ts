import { Form } from "@interfaces/forms";
import { Organization } from "@interfaces/organizations";

export interface Listing {
  id: string;
  title: string;
  description: string;
  startDatetime: string;
  deadline: string;
  endDatetime: string;
  url: string;
  slug: string;
  hero?: string;
  logo?: string;
  organization?: Organization;
  form?: Form;
}

export interface ListingInput {
  title: string;
  description: string;
  startDatetime: string;
  deadline?: string;
  url?: string;
  organization?: Organization;
  form?: Form;
  hero?: string;
}