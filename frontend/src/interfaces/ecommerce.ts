import { User } from "./users";
import { Organization } from "./organizations";

export interface Product {
  id: string;
  name: string;
  price: number;
  decscription: string;
  organization: Organization;
}

export type PaymentStatus = "INITIATED" | "RESERVED" | "CAPTURED" | "CANCELLED" | "REFUNDED" | "FAILED" | "REJECTED";

export interface Order {
  order_id: string;
  product: Product;
  user: User;
  quantity: number;
  total_price: number;
  payment_status: PaymentStatus;
  date: string;
  auth_token: string;
  payment_attempt: number;
}
