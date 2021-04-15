import { gql } from "@apollo/client";

export const FORM_FRAGMENT = gql`
  fragment FormFields on FormType {
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
`;

export const FORM = gql`
  ${FORM_FRAGMENT}
  query Form($formId: ID!) {
    form(formId: $formId) {
      ...FormFields
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
