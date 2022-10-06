import {
  ListingFragment,
  ListingOrganizationFragment,
  ListingWithFormFragment,
  ListingWithFormIdFragment,
  ListingWithResponsesFragment,
} from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Listing = GraphqlType<ListingFragment>;

export type ListingOrganization = GraphqlType<ListingOrganizationFragment>;

export type ListingWithFormId = GraphqlType<ListingWithFormIdFragment>;

export type ListingWithForm = GraphqlType<ListingWithFormFragment>;

export type ListingWithResponses = GraphqlType<ListingWithResponsesFragment>;

export type ListingInput = Omit<ListingWithFormId, "startDatetime" | "endDatetime" | "chips" | "slug"> & {
  startDatetime?: string;
  endDatetime?: string;
  case?: boolean;
  application?: boolean;
  interview?: boolean;
};
