import { gql } from "@apollo/client";

export const GET_ARCHIVEDDOCUMENTS = gql`
    query {
        allArchives {
            id
            title
            description
            date
            typeDoc
            fileLocation
        }
    }
`;
