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
        color
      }
    }
  }
`;

export const LISTING = gql`
  query listing($ID: ID!) {
    listing(id: $ID) {
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
        color
      }
      survey {
        id
      }
    }
  }
`;

export const LISTING_WITH_RESPONDERS = gql`
  query listing($ID: ID!) {
    listing(id: $ID) {
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

export const ORGANIZATIONS = gql`
  query {
    allOrganizations {
      id
      name
      slug
      description
    }
  }
`;

export const ORGANIZATION = gql`
  query organization($ID: ID!) {
    organization(id: $ID) {
      id
      name
      slug
      description
    }
  }
`;

export const ORGANIZATION_FROM_SLUG = gql`
  query organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      absoluteSlug
      description
    }
  }
`;

export const ORGANIZATION_LISTINGS = gql`
  query organization($ID: ID!) {
    organization(id: $ID) {
      listings {
        id
        title
        description
        startDatetime
        deadline
        endDatetime
        url
      }
    }
  }
`;
