import { Survey } from "@interfaces/surveys";

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
  responses?: Response[];
  survey?: Survey;
}

export interface Response {
  id: string;
  response: string;
  applicant: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  absoluteSlug: string;
  description: string;
  parent?: Organization;
  children?: Organization[];
  // TODO: Replace color with logo
  color?: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  year: string;
  email: string;
}
