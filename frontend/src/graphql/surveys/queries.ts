import { gql } from "@apollo/client"

export const SURVEY = gql`
    query survey($ID: ID!){
        survey(id: $ID){
            id
            descriptiveName
            surveyQuestions {
                id
                question {
                    id
                    question
                }
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
