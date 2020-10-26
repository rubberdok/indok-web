import { gql } from "@apollo/client";

export const LISTING_SURVEY = gql``;

export const QUESTIONTYPES = gql`
    query {
        questionTypes {
            id
            name
        }
    }
`;
