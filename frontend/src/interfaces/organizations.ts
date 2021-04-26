import { Event } from "@interfaces/events";
import { Listing } from "@interfaces/listings";

export interface Organization {
  id: string;
  name: string;
  description: string;
  color: string;
  children?: Organization[];
  events?: Event[];
  listings?: Listing[];
  slug: string;
  logoUrl?: string;
}
