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
  url?: string;
  hero?: string;
  logo?: string;
  organization: Organization;
  form?: Pick<Form, "id">;
  chips: string[];
}

export interface ListingWithForm extends Listing {
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
  form?: Form;
  chips: string[];
}

export interface ListingInput extends Omit<Listing, "startDatetime" | "endDatetime" | "chips" | "slug"> {
  startDatetime?: string;
  endDatetime?: string;
  case?: boolean;
  application?: boolean;
  interview?: boolean;
}
