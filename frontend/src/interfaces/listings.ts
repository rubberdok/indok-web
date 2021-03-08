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
  survey?: Survey;
}

// TODO: remove, replace references with organization from organizations.ts
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
