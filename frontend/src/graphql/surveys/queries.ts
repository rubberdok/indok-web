import { gql } from "@apollo/client";

export const SURVEY = gql`
  query survey($surveyId: ID!) {
    survey(surveyId: $surveyId) {
      id
      name
      questions {
        id
        question
        description
        questionType
        options {
          id
          answer
        }
      }
    }
  }
`;

export const SURVEYS = gql`
  query {
    surveys {
      id
      name
    }
  }
`;

export const SURVEY_ANSWERS = gql`
  query survey($surveyId: ID!, $userId: ID!) {
    survey(surveyId: $surveyId) {
      name
      questions {
        id
        question
        description
        questionType
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
