import { Survey } from "@interfaces/surveys";
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
  organization?: Organization;
  survey?: Survey;
}
