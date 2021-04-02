import { gql } from "@apollo/client";

export const INITIATE_ORDER = gql`
  mutation InitiateOrder($productId: ID!, $quantity: Int) {
    initiateOrder(productId: $productId, quantity: $quantity) {
      redirect
    }
  }
`;
