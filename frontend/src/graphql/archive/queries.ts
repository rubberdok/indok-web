/* eslint-disable prettier/prettier */
import { gql } from "@apollo/client";

export const DOCUMENT = gql`
    query {
        allArchives {
            id
            title
            description
            date
            url
            thumbnail
            typeDoc
        }
    }
`;

export const DOCUMENTS = gql`
    query allArchives($ID: ID!) {
        allArchives(id: $ID) {
            id
            title
            description
            date
            url
            thumbnail
            typeDoc
        }
    }
`;
