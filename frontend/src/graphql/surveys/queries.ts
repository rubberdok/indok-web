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
        offeredAnswers {
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

export const SURVEY_RESPONDERS = gql`
  query survey($surveyId: ID!) {
    survey(surveyId: $surveyId) {
      responders {
        id
        firstName
        lastName
      }
    }
  }
`;

export const SURVEY_RESPONSE = gql`
  query survey($surveyId: ID!, $userId: ID!) {
    survey(surveyId: $surveyId) {
      questions {
        id
        question
        description
        position
        questionType {
          id
          name
        }
        offeredAnswers {
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
