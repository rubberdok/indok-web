import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query product($productId: ID!) {
    product(productId: $productId) {
      id
      name
      description
      price
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

export const GET_USER_ORDERS = gql`
  query {
    userOrders {
      id
      quantity
      totalPrice
      paymentStatus
      timestamp
      product {
        id
        name
        description
        price
      }
    }
  }
`;
