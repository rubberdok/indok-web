import { gql } from "@apollo/client";
import { LISTING_WITH_RESPONDERS_FRAGMENT } from "@graphql/listings/fragments";

export const LISTINGS = gql`
  query {
    listings {
      id
      title
      description
      startDatetime
      deadline
      endDatetime
      url
      slug
      organization {
        name
        slug
        logoUrl
      }
    }
  }
`;

export const LISTING = gql`
  query listing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      startDatetime
      deadline
      endDatetime
      url
      organization {
        name
        description
        slug
      }
      form {
        id
      }
    }
  }
`;

export const LISTING_WITH_RESPONDERS = gql`
  ${LISTING_WITH_RESPONDERS_FRAGMENT}
  query listing($id: ID!) {
    listing(id: $id) {
      ...ListingWithRespondersFragment
    }
  }
`;
