import { gql } from "@apollo/client";

export const GET_ORGANIZATION = gql`
  query Organization($orgId: ID!) {
    organization(id: $orgId) {
      id
      name
      events {
        id
        title
        startTime
        shortDescription
        availableSlots
        isFull
        usersAttending {
          id
          username
          firstName
        }
        usersOnWaitingList {
          id
          username
          firstName
        }
      }
    }
  }
`;
