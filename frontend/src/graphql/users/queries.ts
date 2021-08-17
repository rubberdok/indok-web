import { gql } from "@apollo/client";
import { USER_FRAMGENT } from "./fragments";

export const GET_USER_PROFILE = gql`
  query {
    user {
      username
      firstName
      lastName
      phoneNumber
      allergies
      email
      gradeYear
    }
  }
`;

export const EDIT_USER_QUERY = gql`
  query {
    user {
      id
      username
      firstName
      lastName
      phoneNumber
      allergies
      email
      graduationYear
    }
  }
`;

export const GET_USER = gql`
  ${USER_FRAMGENT}
  query user {
    user {
      ...UserFields
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
