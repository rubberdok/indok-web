/* eslint-disable prettier/prettier */
import { gql } from "@apollo/client";

export const DOCUMENTS = gql`
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

export const DOCUMENT = gql`
    query archive($ID: ID!) {
        archive(id: $ID) {
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
