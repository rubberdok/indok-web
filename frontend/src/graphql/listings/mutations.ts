import { gql } from "@apollo/client";
import { LISTING_RESPONSES_FRAGMENT } from "@graphql/listings/fragments";

export const CREATE_LISTING = gql`
  ${LISTING_RESPONSES_FRAGMENT}
  mutation createListing($title: String!, $description: String!, $deadline: DateTime!, $organizationId: ID!) {
    createListing(
      listingData: { title: $title, description: $description, deadline: $deadline, organizationId: $organizationId }
    ) {
      listing {
        ...ListingResponsesFragment
      }
      ok
    }
  }
`;

export const UPDATE_LISTING = gql`
  ${LISTING_RESPONSES_FRAGMENT}
  mutation updateListing(
    $listingId: ID!
    $title: String
    $description: String
    $startDatetime: Datetime
    $endDatetime: Datetime
    $deadline: Datetime
    $url: String
    $organizationId: ID
    $formId: ID
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
        formId: $formId
      }
    ) {
      listing {
        ...ListingResponsesFragment
      }
      ok
    }
  }
`;

export const DELETE_LISTING = gql`
  mutation deleteListing($id: ID!) {
    deleteListing(id: $id) {
      listingId
      ok
    }
  }
`;
