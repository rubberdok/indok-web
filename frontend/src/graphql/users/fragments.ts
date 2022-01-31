import { gql } from "@apollo/client";

export const USER_FRAMGENT = gql`
  fragment UserFields on UserType {
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
`;
