import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($descriptiveName: String!, $description: String) {
    createSurvey(surveyData: { descriptiveName: $descriptiveName, description: $description }) {
      survey {
        id
        descriptiveName
        description
      }
      ok
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($id: ID!, $descriptiveName: String!, $description: String) {
    createSurvey(id: $id, surveyData: { descriptiveName: $descriptiveName, description: $description }) {
      survey {
        id
        descriptiveName
        description
      }
      ok
    }
  }
`;

//temporary implementation until bulk mutation is implemented
export const CREATE_QUESTION = gql`
  mutation CreateQuestion($question: String!, $description: String!, $surveyId: ID!) {
    createQuestion(questionData: { question: $question, description: $description, surveyId: $surveyId }) {
      question {
        id
        question
        description
      }
      ok
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation CreateQuestion($id: ID!, $question: String!, $description: String!) {
    createQuestion(id: $id, questionData: { question: $question, description: $description }) {
      question {
        id
        question
        description
      }
      ok
    }
  }
`;
