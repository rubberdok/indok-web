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
        availableSlots {
          category
          availableSlots
        }
        isFull
        usersAttending {
          username
          firstName
        }
        usersOnWaitingList {
          username
          firstName
        }
      }
      listings {
        id
        title
        deadline
      }
    }
  }
`;
