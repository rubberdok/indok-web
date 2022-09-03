import { gql } from "@apollo/client";
import { FORM_RESPONSES_FRAGMENT } from "@graphql/forms/fragments";

export const FORM_RESPONSES = gql`
  ${FORM_RESPONSES_FRAGMENT}
  query Form($formId: ID!) {
    form(formId: $formId) {
      ...FormResponsesFragment
    }
  }
`;

export const FORM_WITH_QUESTIONS_AND_ANSWERS = gql`
  query Form($formId: ID!) {
    form(formId: $formId) {
      id
      name
      description
      questions {
        id
        question
        options {
          answer
          id
        }
        questionType
        mandatory
        answer {
          id
          answer
        }
      }
    }
  }
`;
