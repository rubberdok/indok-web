import { gql } from "@apollo/client";
import { FORM_FRAGMENT } from "@graphql/forms/fragments";
import { LISTING_FRAGMENT, LISTING_RESPONSES_FRAGMENT } from "@graphql/listings/fragments";

export const LISTINGS = gql`
  ${LISTING_FRAGMENT}
  query {
    listings {
      ...ListingFragment
    }
  }
`;

export const LISTING_APPLICATION = gql`
  ${LISTING_FRAGMENT}
  ${FORM_FRAGMENT}
  query listing($id: ID!) {
    listing(id: $id) {
      ...ListingFragment
      form {
        ...FormFragment
      }
    }
  }
`;

export const LISTING_RESPONSES = gql`
  ${LISTING_RESPONSES_FRAGMENT}
  query listing($id: ID!) {
    listing(id: $id) {
      ...ListingResponsesFragment
    }
  }
`;
