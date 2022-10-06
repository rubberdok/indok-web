import { ListingWithFormIdFragment } from "@/generated/graphql";

export type ListingInput = Omit<ListingWithFormIdFragment, "startDatetime" | "endDatetime" | "chips" | "slug"> & {
  startDatetime?: string;
  endDatetime?: string;
  case?: boolean;
  application?: boolean;
  interview?: boolean;
};
