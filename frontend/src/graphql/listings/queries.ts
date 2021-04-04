import { gql } from "@apollo/client";

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
        id
        name
        slug
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
        id
        name
        description
        slug
      }
      survey {
        id
      }
    }
  }
`;

export const LISTING_WITH_RESPONDERS = gql`
  query listing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      startDatetime
      deadline
      endDatetime
      url
      survey {
        id
        responders {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
