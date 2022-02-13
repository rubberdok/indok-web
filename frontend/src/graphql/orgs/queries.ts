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
        attendable {
          totalAvailableSlots
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
      }
      listings {
        id
        title
        deadline
      }
    }
  }
`;
