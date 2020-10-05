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
