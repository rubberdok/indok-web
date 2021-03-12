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
        year
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
  mutation UpdateUser(
    $email: String
    $firstName: String
    $lastName: String
    $year: Int
    $phoneNumber: String
    $allergies: String
  ) {
    updateUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      year: $year
      phoneNumber: $phoneNumber
      allergies: $allergies
    ) {
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
      }
    }
  }
`;
