import { gql } from "@apollo/client";

export const INITIATE_ORDER = gql`
  mutation InitiateOrder($productId: ID!, $quantity: Int) {
    initiateOrder(productId: $productId, quantity: $quantity) {
      redirect
    }
  }
`;

export const ATTEMPT_CAPTURE_PAYMENT = gql`
  mutation AttemptCapturePayment($orderId: ID!) {
    attemptCapturePayment(orderId: $orderId) {
      status
      order {
        orderId
        product {
          id
          name
          description
          price
        }
        quantity
        totalPrice
        paymentStatus
        date
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
        totalQuantity
        maxBuyableQuantity
      }
      ok
    }
  }
`;
