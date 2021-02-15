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

export const LOG_OUT_USER = gql`
  mutation {
    logOutUser {
      deleted
      idToken
    }
  }
`;
