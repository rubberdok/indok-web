import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($descriptiveName: String!, $description: String, $listingId: ID) {
    createSurvey(listingId: $listingId, surveyData: { descriptiveName: $descriptiveName, description: $description }) {
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
  mutation CreateQuestion(
    $question: String!
    $description: String!
    $position: Int!
    $questionTypeId: ID!
    $surveyId: ID!
  ) {
    createQuestion(
      questionData: {
        question: $question
        description: $description
        position: $position
        questionTypeId: $questionTypeId
        surveyId: $surveyId
      }
    ) {
      question {
        id
        question
        description
        position
      }
      ok
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      deletedId
      ok
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation updateQuestion($id: ID!, $question: String!, $description: String!, $position: Int!, $questionTypeId: ID!) {
    updateQuestion(
      id: $id
      questionData: {
        question: $question
        description: $description
        position: $position
        questionTypeId: $questionTypeId
      }
    ) {
      question {
        id
        question
        description
        position
      }
      ok
    }
  }
`;
