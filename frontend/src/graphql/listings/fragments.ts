import { gql } from "@apollo/client";
import { FORM_RESPONSES_FRAGMENT } from "@graphql/forms/fragments";

export const LISTING_FRAGMENT = gql`
  fragment ListingFragment on ListingType {
    id
    title
    slug
    description
    startDatetime
    deadline
    endDatetime
    url
    chips
    readMore
    organization {
      id
      name
      slug
      logoUrl
    }
  }
`;

export const LISTING_RESPONSES_FRAGMENT = gql`
  ${LISTING_FRAGMENT}
  ${FORM_RESPONSES_FRAGMENT}
  fragment ListingResponsesFragment on ListingType {
    ...ListingFragment
    form {
      ...FormResponsesFragment
    }
  }
`;
