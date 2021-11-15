import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query product($productId: ID!) {
    product(productId: $productId) {
      id
      name
      description
      price
      totalQuantity
      maxBuyableQuantity
    }
  }
`;


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
