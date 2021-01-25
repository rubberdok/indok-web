import { User } from "./users";

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  organization: { id: string; name: string; color?: string };
  category: { id: string; name: string };
  image: string;
  isAttendable: string;
  deadline: string;
  publisher: User;
}

export interface Category {
  id: string;
  name: string;
}
