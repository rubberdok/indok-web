import { gql } from "@apollo/client";

export const INITIATE_ORDER = gql`
  mutation InitiateOrder($productId: ID!, $quantity: Int) {
    initiateOrder(productId: $productId, quantity: $quantity) {
      redirect
      orderId
    }
  }
`;

export const ATTEMPT_CAPTURE_PAYMENT = gql`
  mutation AttemptCapturePayment($orderId: ID!) {
    attemptCapturePayment(orderId: $orderId) {
      status
      order {
        id
        product {
          id
          name
          description
          price
        }
        quantity
        totalPrice
        paymentStatus
        timestamp
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation {
    createProduct {
      product {
        id
        name
        description
        price
        maxBuyableQuantity
      }
      ok
    }
  }
`;
