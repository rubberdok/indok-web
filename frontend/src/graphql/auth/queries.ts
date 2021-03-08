import { gql } from "@apollo/client";

export const GET_USER = gql`
  query {
    user {
      id
      username
      isStaff
      isActive
      isSuperuser
      email
      firstName
      lastName
      feideUserid
      lastLogin
      dateJoined
      year
      events {
        id
      }
    }
  }
`;
