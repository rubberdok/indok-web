import { gql } from "@apollo/client";

export const FORM_FRAGMENT = gql`
  fragment FormFragment on FormType {
    id
    name
    questions {
      id
      question
      description
      questionType
      mandatory
      options {
        id
        answer
      }
    }
    responders {
      id
      firstName
      lastName
    }
  }
`;
