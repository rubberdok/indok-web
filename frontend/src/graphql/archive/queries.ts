import { gql } from "@apollo/client";

export const GET_FEATURED = gql`
  query {
    featuredArchive {
      id
      title
      thumbnail
      featured
      typeDoc
      year
      webLink
    }
  }
`;

export const GET_DOCSBYFILTERS = gql`
  query archiveByTypes($document_types: [String]!, $year: Int, $names: String) {
    archiveByTypes(typeDoc: $document_types, year: $year, names: $names) {
      id
      title
      thumbnail
      typeDoc
      year
      webLink
    }
  }
`;

export const GET_YEARS_SELECTOR = gql`
  query {
    yearsSelector
  }
`;
