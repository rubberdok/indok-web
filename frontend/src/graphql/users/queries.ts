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
      graduationYear
      gradeYear
      allergies
      phoneNumber
      firstLogin
      events {
        id
      }
      organizations {
        id
        name
      }
    }
  }
`;
