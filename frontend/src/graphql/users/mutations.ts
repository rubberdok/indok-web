import { gql } from "@apollo/client";

export const AUTHENTICATE = gql`
  mutation AuthUser($code: String!) {
    authUser(code: $code) {
      token
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
      }
      isIndokStudent
      idToken
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
  mutation UpdateUser($userData: UserInput) {
    updateUser(userData: $userData) {
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
      }
    }
  }
`;
