import { gql } from "@apollo/client";
import { FORM_RESPONSES_FRAGMENT, QUESTION_ANSWERS_FRAGMENT } from "@graphql/forms/fragments";

export const CREATE_FORM = gql`
  ${FORM_RESPONSES_FRAGMENT}
  mutation CreateForm($name: String!, $description: String, $listingId: ID) {
    createForm(listingId: $listingId, formData: { name: $name, description: $description }) {
      form {
        ...FormResponsesFragment
      }
      ok
    }
  }
`;

export const UPDATE_FORM = gql`
  ${FORM_RESPONSES_FRAGMENT}
  mutation UpdateForm($id: ID!, $name: String!, $description: String) {
    updateForm(id: $id, formData: { name: $name, description: $description }) {
      form {
        ...FormResponsesFragment
      }
      ok
    }
  }
`;

export const CREATE_QUESTION = gql`
  ${QUESTION_ANSWERS_FRAGMENT}
  mutation CreateQuestion(
    $formId: ID!
    $question: String!
    $description: String
    $questionType: QuestionTypeEnum
    $mandatory: Boolean
  ) {
    createQuestion(
      questionData: {
        question: $question
        description: $description
        formId: $formId
        questionType: $questionType
        mandatory: $mandatory
      }
    ) {
      question {
        ...QuestionAnswersFragment
      }
      ok
    }
  }
`;

export const UPDATE_QUESTION = gql`
  ${QUESTION_ANSWERS_FRAGMENT}
  mutation UpdateQuestion(
    $id: ID!
    $question: String
    $description: String
    $questionType: QuestionTypeEnum
    $mandatory: Boolean
    $options: [OptionInput]
  ) {
    createUpdateAndDeleteOptions(questionId: $id, optionData: $options) {
      ok
    }
    updateQuestion(
      id: $id
      questionData: {
        question: $question
        description: $description
        questionType: $questionType
        mandatory: $mandatory
      }
    ) {
      question {
        ...QuestionAnswersFragment
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
