import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
  mutation AuthUser($code: String!) {
    authUser(code: $code) {
      token
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
