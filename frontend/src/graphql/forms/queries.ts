import { gql } from "@apollo/client";
import { FORM_FRAGMENT } from "@graphql/forms/fragments";

export const FORM = gql`
  ${FORM_FRAGMENT}
  query Form($formId: ID!) {
    form(formId: $formId) {
      ...FormFragment
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
