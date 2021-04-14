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

export const USER_WITH_ORGANIZATIONS = gql`
  query {
    user {
      organizations {
      id
      name
    }
    }
  }
`;