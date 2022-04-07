import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "./fragments";

export const AUTHENTICATE = gql`
  ${USER_FRAGMENT}
  mutation AuthUser($code: String!) {
    authUser(code: $code) {
      user {
        ...UserFields
      }
    }
  }
`;

export const DELETE_TOKEN_COOKIE = gql`
  mutation {
    deleteTokenCookie {
      deleted
    }
  }
`;

export const GET_ID_TOKEN = gql`
  mutation {
    getIdToken {
      idToken
    }
  }
`;

export const UPDATE_USER = gql`
  ${USER_FRAGMENT}
  mutation UpdateUser($userData: UserInput) {
    updateUser(userData: $userData) {
      user {
        ...UserFields
      }
    }
  }
`;
