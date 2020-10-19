/* eslint-disable prettier/prettier */
import { gql } from "@apollo/client";

export const GET_ARCHIVEDDOCUMENTS = gql`
    query {
        allArchives {
            id
            title
            description
            date
        }
    }
`;

export const GET_FILELOCATION = gql`
    query {
        allArchives {
            id
            fileLocation
        }
    }
`;

export const GET_DOCUMENTTYPE = gql`
    query {
        allArchives {
            id
            typeDoc
        }
    }
`;

console.log(GET_ARCHIVEDDOCUMENTS);
console.log(GET_FILELOCATION);
console.log(GET_DOCUMENTTYPE);
