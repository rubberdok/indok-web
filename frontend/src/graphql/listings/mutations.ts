import { gql } from "@apollo/client";

export const CREATE_LISTING = gql`
  mutation createListing(
    $title: String!
    $description: String!
    $startDatetime: DateTime!
    $deadline: DateTime!
    $endDatetime: DateTime!
    $url: String!
    $organizationId: ID
  ) {
    createListing(
      listingData: {
        title: $title
        description: $description
        startDatetime: $startDatetime
        deadline: $deadline
        endDatetime: $endDatetime
        url: $url
        organizationId: $organizationId
      }
    ) {
      listing {
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
        }
      }
      ok
    }
  }
`;

export const DELETE_LISTING = gql`
  mutation deleteListing($ID: ID!) {
    deleteListing(id: $ID) {
      ok
      listingId
    }
  }
`;

export const CREATE_RESPONSE = gql`
  mutation createResponse($response: String!, $applicantId: ID!, $listingId: ID!) {
    createResponse(responseData: { response: $response, applicantId: $applicantId, listingId: $listingId }) {
      response {
        id
        response
      }
      ok
    }
  }
`;

export const DELETE_RESPONSE = gql`
  mutation deleteResponse($ID: ID!) {
    deleteResponse(responseId: $ID) {
      response {
        id
      }
      ok
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization($name: String!, $description: String!) {
    createOrganization(organizationData: { name: $name, description: $description }) {
      organization {
        id
        name
        description
        slug
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $firstName: String!, $lastName: String!, $year: Int!, $password: String!) {
    createUser(
      userData: { username: $username, firstName: $firstName, lastName: $lastName, year: $year, password: $password }
    ) {
      user {
        username
        firstName
        lastName
        year
        password
      }
    }
  }
`;
