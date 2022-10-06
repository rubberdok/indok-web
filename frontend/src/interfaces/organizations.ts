import { Event } from "@/interfaces/events";
import { Listing } from "@/interfaces/listings";

import { User } from "./users";

export interface Organization {
  id: string;
  name: string;
  description: string;
  color: string | null;
  users: User[];
  children?: Organization[];
  events?: Event[];
  listings?: Listing[];
  slug: string;
  logoUrl?: string;
  primaryGroup: {
    uuid: string;
  };
  hrGroup: {
    uuid: string;
  };
}
