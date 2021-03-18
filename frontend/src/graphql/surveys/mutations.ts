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

export const CREATE_QUESTION = gql`
  mutation CreateQuestion(
    $question: String!
    $description: String!
    $position: Int!
    $questionType: ID
    $surveyId: ID!
  ) {
    createQuestion(
      questionData: {
        question: $question
        description: $description
        position: $position
        questionType: $questionType
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
  mutation updateQuestion(
    $id: ID!
    $question: String!
    $description: String!
    $position: Int!
    $questionType: ID
    $options: [OptionInput]!
  ) {
    updateQuestion(
      id: $id
      questionData: {
        question: $question
        description: $description
        position: $position
        questionType: $questionType
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
    createUpdateAndDeleteOptions(optionData: $options) {
      options {
        answer
      }
      ok
    }
  }
`;

export const CREATE_ANSWER = gql`
  mutation createAnswer($questionId: ID!, $answer: String!) {
    createAnswer(answerData: { questionId: $questionId, answer: $answer }) {
      answer {
        id
        answer
      }
      ok
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation updateAnswer($id: ID!, $answer: String!) {
    updateAnswer(id: $id, answerData: { answer: $answer }) {
      answer {
        id
        answer
      }
      ok
    }
  }
`;

export const SUBMIT_ANSWERS = gql`
  mutation submitAnswers($answersData: [AnswerInput]) {
    submitAnswers(answersData: $answersData) {
      ok
    }
  }
`;

export const DELETE_ANSWER = gql`
  mutation deleteAnswer($id: ID!) {
    deleteAnswer(id: $id) {
      deletedId
      ok
    }
  }
`;
