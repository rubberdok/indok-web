import { User } from "./users";
import { Organization } from "./organizations";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  organization: Organization;
  totalQuantity: number; // Maybe remove this before merge to prod
  maxBuyableQuantity: number;
}

export type PaymentStatus = "INITIATED" | "RESERVED" | "CAPTURED" | "CANCELLED" | "REFUNDED" | "FAILED" | "REJECTED";

export type Order = {
  orderId: string;
  product: Product;
  user: User;
  quantity: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  date: string;
  authToken: string;
  paymentAttempt: number;
}
