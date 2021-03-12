import { gql } from "@apollo/client";

export const GET_USER = gql`
  query {
    user {
      id
      feideEmail
      email
      username
      firstName
      lastName
      dateJoined
      year
      allergies
      phoneNumber
      firstLogin
      events {
        id
      }
    }
  }
`;
