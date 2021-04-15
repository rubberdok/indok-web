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
      chips
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
  query listing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      startDatetime
      deadline
      endDatetime
      url
      form {
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
