import { gql } from "@apollo/client";

export const FORM = gql`
  query Form($formId: ID!) {
    form(formId: $formId) {
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
    }
  }
`;

export const FORM_ANSWERS = gql`
  query FormAnswers($formId: ID!, $userId: ID!) {
    form(formId: $formId) {
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
        answer(userId: $userId) {
          id
          answer
        }
      }
    }
  }
`;
