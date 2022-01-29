import { gql } from "@apollo/client";
import { USER_FRAMGENT } from "./fragments";

export const GET_USER_INFO = gql`
  ${USER_FRAMGENT}
  query userInfo {
    user {
      ...UserFields
    }
  }
`;

export const EDIT_USER_QUERY = gql`
  query editUserInfo {
    user {
      id
      username
      firstName
      lastName
      phoneNumber
      allergies
      email
      graduationYear
      firstLogin
      feideEmail
      canUpdateYear
      yearUpdatedAt
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
