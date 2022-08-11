import { gql } from "@apollo/client";

export const CREATE_LISTING = gql`
  mutation createListing($input: CreateListingInput!) {
    createListing(listingData: $input) {
      listing {
        id
        slug
      }
      ok
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation updateListing($id: ID!, $input: BaseListingInput) {
    updateListing(id: $id, listingData: $input) {
      listing {
        id
        slug
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
