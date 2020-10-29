import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
    mutation CreateSurvey($input: SurveyInput!) {
        createSurvey(surveyData: $input) {
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
    mutation UpdateSurvey($id: ID!, $input: SurveyInput) {
        createSurvey(id: $id, surveyData: $input) {
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
    mutation CreateQuestion($input: QuestionInput!) {
        createQuestion(questionData: $input) {
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
    mutation CreateQuestion($id: ID!, $input: QuestionInput) {
        createQuestion(id: $id, questionData: $input) {
            question {
                id
                question
                description
            }
            ok
        }
    }
`;
