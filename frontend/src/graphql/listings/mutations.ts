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
    $surveyId: ID
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
        surveyId: $surveyId
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
        survey {
          id
        }
      }
      ok
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation updateListing(
    $listingId: ID!
    $title: String
    $description: String
    $startDatetime: Datetime
    $endDatetime: Datetime
    $deadline: Datetime
    $url: String
    $organizationId: ID
    $surveyId: ID
  ) {
    updateListing(
      id: $listingId
      listingData: {
        title: $title
        description: $description
        startDatetime: $startDatetime
        deadline: $deadline
        endDatetime: $endDatetime
        url: $url
        organizationId: $organizationId
        surveyId: $surveyId
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
        survey {
          id
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
