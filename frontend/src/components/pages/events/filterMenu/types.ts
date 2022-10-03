import { FilterQuery } from "@/components/pages/events/AllEvents";

export type HandleChecked = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof FilterQuery,
  filter: FilterQuery[typeof field]
) => void;
