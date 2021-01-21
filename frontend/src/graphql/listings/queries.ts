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
    }
  }
`;

export const RESPONSES = gql`
  query listing($ID: ID!) {
    listing(id: $ID) {
      responses {
        id
        response
        applicant {
          id
          username
          firstName
          lastName
          year
          email
        }
      }
    }
  }
`;

export const RESPONSE = gql`
  query response($responseID: ID!) {
    response(id: $responseID) {
      id
      response
      applicant {
        id
        username
        firstName
        lastName
        year
        email
      }
    }
  }
`;

export const USER_RESPONSE = gql`
  query userResponse($listingID: ID!) {
    responseByListingId(listingId: $listingID) {
      id
      response
      applicant {
        id
        username
        firstName
        lastName
        year
        email
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
        responses {
          id
        }
      }
    }
  }
`;

export const USERS = gql`
  query {
    users {
      id
      username
      firstName
      lastName
      year
      email
    }
  }
`;

export const USER = gql`
  query user($ID: ID!) {
    oldUser(id: $ID) {
      id
      username
      firstName
      lastName
      year
      email
    }
  }
`;
