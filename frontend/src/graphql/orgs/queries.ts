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
          user {
            username
            firstName
          }
        }
        usersOnWaitingList {
          id
          user {
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

export const GET_ORGANIZATION_USERS = gql`
  query getOrgUsers($orgId: ID!) {
    organization(id: $orgId) {
      id
      name
      users {
        id
        username
        firstName
        lastName
        memberships {
          id
          group {
            uuid
          }
          organization {
            id
            name
            hrGroup {
              uuid
            }
            primaryGroup {
              uuid
            }
          }
        }
      }
    }
  }
`;
