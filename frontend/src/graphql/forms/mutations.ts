import { gql } from "@apollo/client";

export const CREATE_FORM = gql`
  mutation CreateForm($name: String!, $description: String, $listingId: ID) {
    createForm(listingId: $listingId, formData: { name: $name, description: $description }) {
      form {
        id
        name
        description
      }
      ok
    }
  }
`;

export const UPDATE_FORM = gql`
  mutation UpdateForm($id: ID!, $name: String!, $description: String) {
    createForm(id: $id, formData: { name: $name, description: $description }) {
      form {
        id
        name
        description
      }
      ok
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($formId: ID!, $question: String!, $description: String, $questionType: QuestionTypeEnum) {
    createQuestion(
      questionData: { question: $question, description: $description, formId: $formId, questionType: $questionType }
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
  mutation UpdateQuestion(
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
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      deletedId
      ok
    }
  }
`;

export const SUBMIT_ANSWERS = gql`
  mutation SubmitAnswers($formId: ID!, $answersData: [AnswerInput]) {
    submitAnswers(formId: $formId, answersData: $answersData) {
      ok
    }
  }
`;
