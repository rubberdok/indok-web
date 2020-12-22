import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
  mutation AuthUser($code: String!, $state: String) {
    authUser(code: $code, state: $state) {
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
        password
        dateJoined
        year
      }
    }
  }
`;
