/* eslint-disable prettier/prettier */
import { gql } from "@apollo/client";

export const GET_ARCHIVEDDOCUMENTS = gql`
    query {
        allArchivedDocs {
            id
            title
            description
            date
        }
    }
`;

export const GET_DOCUMENTTYPE = gql`
    query {
        allArchivedDocs {
            typeDoc
        }
    }
`;
