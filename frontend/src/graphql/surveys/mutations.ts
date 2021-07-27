import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($name: String!, $description: String, $listingId: ID) {
    createSurvey(listingId: $listingId, surveyData: { name: $name, description: $description }) {
      survey {
        id
        name
        description
      }
      ok
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($id: ID!, $name: String!, $description: String) {
    createSurvey(id: $id, surveyData: { name: $name, description: $description }) {
      survey {
        id
        name
        description
      }
      ok
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($surveyId: ID!, $question: String!, $description: String, $questionType: QuestionTypeEnum) {
    createQuestion(
      questionData: { question: $question, description: $description, surveyId: $surveyId, questionType: $questionType }
    ) {
      question {
        id
        question
        description
        questionType
      }
      ok
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation updateQuestion(
    $id: ID!
    $question: String
    $description: String
    $questionType: QuestionTypeEnum
    $options: [OptionInput]
  ) {
    updateQuestion(
      id: $id
      questionData: { question: $question, description: $description, questionType: $questionType }
    ) {
      question {
        id
        question
        description
        questionType
      }
      ok
    }
    createUpdateAndDeleteOptions(questionId: $id, optionData: $options) {
      options {
        answer
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

export const SUBMIT_ANSWERS = gql`
  mutation submitAnswers($surveyId: ID!, $answersData: [AnswerInput]) {
    submitAnswers(surveyId: $surveyId, answersData: $answersData) {
      ok
    }
  }
`;
