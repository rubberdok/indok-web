import { AdminEventFragment } from "@/generated/graphql";
import { Listing } from "@/interfaces/listings";

export interface Organization {
  id: string;
  name: string;
  description: string;
  color: string | null;
  children?: Organization[];
  events?: AdminEventFragment[];
  listings?: Listing[];
  slug: string;
  logoUrl?: string;
}
