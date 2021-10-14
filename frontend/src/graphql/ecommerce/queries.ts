import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query products {
    products {
      id
      name
      description
      price
    }
  }
`;
