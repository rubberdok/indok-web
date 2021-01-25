import { gql } from "@apollo/client";

export const DOCUMENTS = gql`
  query {
    allArchives {
      id
      title
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
      url
      thumbnail
      typeDoc
    }
  }
`;

export const GET_DOCSBYTYPE = gql`
  query archiveByType($document_types: [String]!) {
    archiveByType(typeDocs: $document_types) {
      id
      title
      url
      thumbnail
      typeDoc
    }
  }
`;
