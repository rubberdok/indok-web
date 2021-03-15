import { gql } from "@apollo/client";

export const SURVEY = gql`
  query survey($surveyId: ID!) {
    survey(surveyId: $surveyId) {
      id
      descriptiveName
      questions {
        id
        question
        description
        position
        questionType {
          id
          name
        }
        options {
          id
          answer
        }
      }
    }
  }
`;

export const QUESTIONTYPES = gql`
  query {
    questionTypes {
      id
      name
    }
  }
`;

export const SURVEYS = gql`
  query {
    surveys {
      id
      descriptiveName
    }
  }
`;

export const SURVEY_ANSWERS = gql`
  query survey($surveyId: ID!, $userId: ID!) {
    survey(surveyId: $surveyId) {
      descriptiveName
      questions {
        id
        question
        description
        position
        questionType {
          id
          name
        }
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
