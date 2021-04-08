import { Event } from "@interfaces/events";

export interface Organization {
  id: string;
  name: string;
  children?: Organization[];
  events?: Event[];
}
