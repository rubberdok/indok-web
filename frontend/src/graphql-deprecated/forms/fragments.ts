import { gql } from "@apollo/client";

export const QUESTION_FRAGMENT = gql`
  fragment QuestionFragment on QuestionType {
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
`;

export const FORM_FRAGMENT = gql`
  ${QUESTION_FRAGMENT}
  fragment FormFragment on FormType {
    id
    name
    questions {
      ...QuestionFragment
    }
  }
`;

export const QUESTION_ANSWERS_FRAGMENT = gql`
  ${QUESTION_FRAGMENT}
  fragment QuestionAnswersFragment on QuestionType {
    ...QuestionFragment
    answers {
      id
    }
  }
`;

export const FORM_RESPONSES_FRAGMENT = gql`
  ${QUESTION_ANSWERS_FRAGMENT}
  fragment FormResponsesFragment on FormType {
    id
    name
    questions {
      ...QuestionAnswersFragment
    }
    responses {
      id
      respondent {
        id
        firstName
        lastName
      }
      answers {
        id
        answer
        question {
          id
        }
      }
    }
  }
`;
