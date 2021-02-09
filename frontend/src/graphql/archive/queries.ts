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

export const GET_DOCSBYFILTERS = gql`
  query archiveByTypes($document_types: [String]!, $year: Int) {
    archiveByTypes(typeDoc: $document_types, year: $year) {
      id
      title
      url
      thumbnail
      typeDoc
      year
    }
  }
`;
